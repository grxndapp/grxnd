import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/app/actions/user';
import Stripe from 'stripe';

export async function POST() {
   try {
      const user = await getCurrentUser();
      if (!user) return NextResponse.json({ error: 'Please sign in first' }, { status: 401 });

      const customerId = user.stripeCustomerId;
      if (!customerId) throw new Error('User has no Stripe customer ID');

      const secretKey = process.env.STRIPE_SECRET_KEY;
      const priceId = 'price_1USRXeE7sK0TWDbZHmmMMubQ';
      const appUrl = process.env.NEXTAUTH_URL;

      if (!secretKey || !priceId || !appUrl) throw new Error('Missing Stripe Checkout configuration');

      const stripe = new Stripe(secretKey);

      // Direct existing subscribers to billing management instead
      // of creating another subscription.
      for await (const subscription of stripe.subscriptions.list({
         customer: customerId,
         status: 'all',
         limit: 100,
      })) {
         if (subscription.status !== 'canceled' && subscription.status !== 'incomplete_expired') {
            return NextResponse.json({
               error: 'You already have a subscription. Manage your existing subscription instead.',
            }, { status: 409 });
         }
      }

      // This ties Checkout to their existing Stripe customer.
      const session = await stripe.checkout.sessions.create({
         mode: 'subscription',
         customer: customerId,
         line_items: [{
            price: priceId,
            quantity: 1,
         }],
         success_url: new URL('/pricing?checkout=success', appUrl).toString(),
         cancel_url: new URL('/pricing?checkout=cancelled', appUrl).toString(),
      });
      if (!session.url) throw new Error('Stripe returned no Checkout URL');

      return NextResponse.json({ url: session.url });
   } catch (error: unknown) {
      console.error('Checkout creation failed', { message: error instanceof Error ? error.message : 'Unknown error' });
      return NextResponse.json({ error: 'Unable to start checkout. Please try again.' }, { status: 500 });
   }
}