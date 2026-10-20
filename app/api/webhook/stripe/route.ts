import { getUserByEmail, manageUserSubscription } from '@/app/actions/user';
import { plans } from '@/lib/stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import CancelledSubscriptionEmail from '@/emails/CancelledSubscriptionEmail';
import WelcomeToGrxndEmail from '@/emails/WelcomeEmail';
import Stripe from 'stripe'
import sendMail from '@/lib/sendMail';

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
         if (!plan) {
            console.error("Invalid Plan - Price Id");
            return NextResponse.json({ error: "invalid plan" }, { status: 500 })
         }

         // get user
         if (!customer.email) {
            console.error("No User Found");
            return NextResponse.json({ error: "No User Found" }, { status: 500 });
         }

         const user = await getUserByEmail(customer.email);
         if (!user) {
            console.error("User does not exist");
            return NextResponse.json({ error: "User does not exist" }, { status: 500 })
         }

         // give user basic permissions
         const subscribed = await manageUserSubscription(customer.email, true);
         if (subscribed) {
            await sendMail(
               customer.email, `Your Grxnd Subscription Is Active`,
               WelcomeToGrxndEmail({ username: customer.name! })
            );
            console.log(`${customer.email} Subscribed to Grxnd`);
         } else {
            console.error("Failed to Update User Subscription");
            return NextResponse.json({ error: "Failed to Update User Subscription" }, { status: 500 })
         }

      } else if (eventType == 'customer.subscription.deleted') {
         // ❌ Revoke access to the product
         const session = data.object as Stripe.Subscription;
         const customerId = session.customer;
         const customer = await stripe.customers.retrieve(customerId as string) as Stripe.Customer;

         if (!customer.email) {
            console.error("No User Found");
            return NextResponse.json({ error: "No User Found" }, { status: 500 });
         }

         // get user
         const user = await getUserByEmail(customer.email!);
         if (!user) {
            console.error("User does not exist");
            return NextResponse.json({ error: "User does not exist" }, { status: 500 })
         }

         // Remove user subscription permission
         const unsubscribed = await manageUserSubscription(user.email, false);
         if (unsubscribed) {
            await sendMail(
               user.email, `Your Grxnd Subscription Has Been Cancelled`,
               CancelledSubscriptionEmail({ username: user.name })
            );
            console.log(`${user.email} cancelled their subscription`);
         } else {
            console.error("Failed to Update User Subscription");
            return NextResponse.json({ error: "Failed to Update User Subscription" }, { status: 500 })
         }

      } else if (eventType == 'customer.subscription.updated') {
         const subscription = data.object as Stripe.Subscription;
         const previousSubscription: Stripe.Subscription | undefined = data.object.previous_attributes;

         const customerId = subscription.customer;
         const customer: any = await stripe.customers.retrieve(customerId as string);

         if (!customer.email) {
            console.error("No User Found");
            return NextResponse.json({ error: "No User Found" }, { status: 500 });
         }

         const user = await getUserByEmail(customer.email);
         if (!user) {
            console.error("User does not exist");
            return NextResponse.json({ error: "User does not exist" }, { status: 500 })
         }

         if (subscription.status === 'active' && subscription.start_date !== (previousSubscription?.start_date || 0)) {
            const subscribed = await manageUserSubscription(user.email, true);
            if (subscribed) {
               console.log(`${user.email} has renewed their subscription`);
            } else {
               console.error("Failed to Update User Subscription");
               return NextResponse.json({ error: "Failed to Update User Subscription" }, { status: 500 })
            }
         }
      }
   } catch (err: any) {
      return NextResponse.json({ error: "error" }, { status: 500 })
   }

   return new Response(JSON.stringify({}));
}