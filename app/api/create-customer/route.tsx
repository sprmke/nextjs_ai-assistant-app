import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { ConvexHttpClient } from 'convex/browser';
import { api } from '@/convex/_generated/api';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  try {
    const { email, name } = await req.json();

    // First, check if customer already exists
    const existingCustomers = await stripe.customers.list({
      email: email,
      limit: 1,
    });

    let customer;
    if (existingCustomers.data.length > 0) {
      // Customer already exists, return the existing one
      customer = existingCustomers.data[0];
    } else {
      // Create a new customer
      customer = await stripe.customers.create({
        email,
        name,
      });
    }

    // Update user record with Stripe customer ID
    const user = await convex.query(api.users.GetUser, { email });
    if (user) {
      await convex.mutation(api.users.UpdateUserStripeCustomerId, {
        userId: user._id,
        stripeCustomerId: customer.id,
      });
    }

    return NextResponse.json(customer);
  } catch (error) {
    console.error('Error creating/finding customer:', error);
    return NextResponse.json(
      { error: 'Failed to create/find customer' },
      { status: 500 }
    );
  }
}
