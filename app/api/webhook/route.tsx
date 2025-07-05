import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const PRO_PLAN_CREDITS = 10000;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.payment_status === 'paid' && session.customer) {
          const customerId = session.customer as string;

          // Try to find user by Stripe customer ID first
          let user = await convex.query(api.users.GetUserByStripeCustomerId, {
            stripeCustomerId: customerId,
          });

          // Fallback to email lookup if not found by customer ID
          if (!user && session.customer_details?.email) {
            user = await convex.query(api.users.GetUser, {
              email: session.customer_details.email,
            });
          }

          if (user) {
            await convex.mutation(api.users.UpdateUserTokens, {
              userId: user._id,
              credits: user.credits + PRO_PLAN_CREDITS,
              orderId: session.subscription as string,
            });

            console.log(
              `Updated credits for user ${user.email} after successful payment`
            );
          }
        }
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;

        if (invoice.customer && invoice.subscription) {
          const customerId = invoice.customer as string;

          // Try to find user by Stripe customer ID first
          let user = await convex.query(api.users.GetUserByStripeCustomerId, {
            stripeCustomerId: customerId,
          });

          // Fallback to email lookup if not found by customer ID
          if (!user) {
            const customer = (await stripe.customers.retrieve(
              customerId
            )) as Stripe.Customer;
            if (customer.email) {
              user = await convex.query(api.users.GetUser, {
                email: customer.email,
              });
            }
          }

          if (user) {
            await convex.mutation(api.users.UpdateUserTokens, {
              userId: user._id,
              credits: user.credits + PRO_PLAN_CREDITS,
              orderId: invoice.subscription as string,
            });

            console.log(
              `Updated credits for user ${user.email} after recurring payment`
            );
          }
        }
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
