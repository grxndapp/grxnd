import { NextResponse } from 'next/server';
import { getUserFromStripeCustomerId, setUserAccessById } from '@/app/actions/billing-user';
import { sendSubscriptionCancellationEmail, sendSubscriptionSuccessEmail } from '@/lib/sendMail';
import Stripe from 'stripe'

// Use Stripe secret key from env
const secretKey = process.env.STRIPE_SECRET_KEY!;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

if (!secretKey || !webhookSecret) {
   throw new Error('Missing Stripe environment variables');
}

const stripe = new Stripe(secretKey);

async function getStripeCustomer (customer: string | Stripe.Customer | Stripe.DeletedCustomer | null): Promise<Stripe.Customer> {
   if (!customer) throw new Error('Event has no Stripe customer');
   const result = typeof customer === 'string'
      ? await stripe.customers.retrieve(customer)
      : customer;

   if (result.deleted) throw new Error(`Stripe customer ${result.id} has been deleted`);

   return result;
}

async function customerHasAccess(customerId: string): Promise<boolean> {
   const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
   });
   return subscriptions.data.length > 0;
}

export async function POST(req: Request) {
   const body = await req.text();
   const signature = req.headers.get('stripe-signature');

   if (!signature) {
      return NextResponse.json({ error: 'Missing Stripe signature' }, { status: 400 });
   }

   let event: Stripe.Event;
   // verify Stripe event is legit
   try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
   } catch (error) {
      console.error('Stripe signature verification failed', error);
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 400 });
   }

   try {
      let customerReference: | string | Stripe.Customer | Stripe.DeletedCustomer | null;

      if (event.type === 'checkout.session.completed') {
         const session = event.data.object;
         if (session.mode !== 'subscription') return NextResponse.json({ received: true, ignored: true });
         customerReference = session.customer;
      } else if (event.type === 'customer.subscription.deleted') {
         const subscription = event.data.object;
         customerReference = subscription.customer;
      } else if (event.type === 'customer.subscription.updated') {
         const subscription = event.data.object;
         customerReference = subscription.customer;
      } else {
         return NextResponse.json({ received: true, ignored: true });
      }

      const customer = await getStripeCustomer(customerReference);
      const user = await getUserFromStripeCustomerId(customer.id);
      if (!user?.userid) throw new Error(`No valid user for customer ${customer.id}`);

      // Use current customer-wide state, not the status of an old event.
      const hasAccess = await customerHasAccess(customer.id);
      const previouslyHadAccess = Boolean(user.is_subscribed);

      // Always persist the calculated state.
      // Your helper must treat "already has this value" as success.
      const updated = await setUserAccessById(user.userid, hasAccess);
      if (!updated) throw new Error('Failed to update user subscription access');

      // These helpers catch email failures internally.
      if (!previouslyHadAccess && hasAccess) {
         await sendSubscriptionSuccessEmail(user as User);
      } else if (previouslyHadAccess && !hasAccess && event.type === 'customer.subscription.deleted') {
         await sendSubscriptionCancellationEmail(user as User);
      }

      console.info('Stripe access synchronized', {
         eventId: event.id,
         eventType: event.type,
         customerId: customer.id,
         userId: user.userid,
         previouslyHadAccess,
         hasAccess,
      });

      return NextResponse.json({ received: true });
   } catch (error: unknown) {
      console.error('Stripe webhook processing failed', {
         eventId: event.id,
         eventType: event.type,
         message: error instanceof Error ? error.message : 'Unknown error',
      });
      return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
   }
}