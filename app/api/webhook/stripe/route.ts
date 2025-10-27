import { sendEmailFromGrxnd } from '@/app/actions/email';
import { createUserAccount, getUserByEmail, manageUserSubscription } from '@/app/actions/user';
import { plans } from '@/app/pricing/page';
import { uuid } from '@/utils/uuid';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import CancelledSubscriptionEmail from '@/emails/CancelledSubscriptionEmail';
import WelcomeToGrxndEmail from '@/emails/WelcomeEmail';
import Stripe from 'stripe'

// Use Stripe secret key from env
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
   const body = await req.text();
   const signature = (await headers()).get('stripe-signature')!;

   let data;
   let eventType;
   let event: Stripe.Event;

   // verify Stripe event is legit
   try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret) as Stripe.Event;
   } catch (err: any) {
      console.error(`Webhook signature verification failed. ${err.message}`);
      return NextResponse.json({ error: err.message }, { status: 500 });
   }

   data = event.data as any;
   eventType = event.type;

   try {
      if (eventType == 'checkout.session.completed') {
         // First payment is successful and a subscription is created 
         // ✅ Grant access to the product
         const session = await stripe.checkout.sessions.retrieve(data.object.id, {
            expand: ['line_items']
         });
         const customerId = session?.customer!;
         const customer = await stripe.customers.retrieve(customerId as string) as Stripe.Customer;

         const priceId = session.line_items?.data[0].price?.id;
         const plan = plans.find(p => p.priceId === priceId);
         if (!plan) return NextResponse.json({ error: "invalid plan" }, { status: 500 })

         // get user
         if (!customer.email) return NextResponse.json({ error: "no user found" }, { status: 500 });

         const user = await getUserByEmail(customer.email);
         const defaultPassword = user ? '' : uuid().replaceAll("-","").substring(0,9);
         if (!user) {
            await createUserAccount({
               name: customer.name || customer.email.split("@")[0],
               email: customer.email,
               password: defaultPassword
            })
         }

         // give user basic permissions
         const subscribed = await manageUserSubscription(customer.email, true);
         if (subscribed) {
            await sendEmailFromGrxnd(
               customer.email, `Your Grxnd Subscription Is Active`,
               WelcomeToGrxndEmail({
                  username: customer.name!,
                  password: (defaultPassword == '') ? undefined : defaultPassword
               })
            );
            console.log(`${customer.email} subscribed to grxnd`);
         } else {
            return NextResponse.json({ error: "failed to update user subscription" }, { status: 500 })
         }

      } else if (eventType == 'customer.subscription.deleted') {
         // ❌ Revoke access to the product
         const session = data.object as Stripe.Subscription;
         const customerId = session.customer;
         const customer = await stripe.customers.retrieve(customerId as string) as Stripe.Customer;

         if (!customer.email) {
            return NextResponse.json({ error: "user not found" }, { status: 500 });
         }

         // get user
         const user = await getUserByEmail(customer.email!);
         if (!user) return NextResponse.json({ error: "user does not exist" }, { status: 500 })

         // Remove user subscription permission
         const unsubscribed = await manageUserSubscription(user.email, false);
         if (unsubscribed) {
            await sendEmailFromGrxnd(
               user.email, `Your Grxnd Subscription Has Been Cancelled`,
               CancelledSubscriptionEmail({ username: user.name })
            );
            console.log(`${user.email} cancelled their subscription`);
         } else {
            return NextResponse.json({ error: "failed to update user subscription" }, { status: 500 })
         }

      } else if (eventType == 'customer.subscription.updated') {
         const subscription = data.object as Stripe.Subscription;
         const previousSubscription: Stripe.Subscription | undefined = data.object.previous_attributes;

         const customerId = subscription.customer;
         const customer: any = await stripe.customers.retrieve(customerId as string);

         const user = await getUserByEmail(customer.email);
         if (!user) return NextResponse.json({ error: "user does not exist" }, { status: 500 })

         if (subscription.status === 'active' && subscription.start_date !== (previousSubscription?.start_date || 0)) {
            const subscribed = await manageUserSubscription(user.email, true);
            if (subscribed) {
               console.log(`${user.email} has renewed their subscription`);
            } else {
               return NextResponse.json({ error: "failed to update user subscription" }, { status: 500 })
            }
         }
      }
   } catch (err: any) {
      return NextResponse.json({ error: "error" }, { status: 500 })
   }

   return new Response(JSON.stringify({}));
}