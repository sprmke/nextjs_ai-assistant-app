import { NextRequest, NextResponse } from 'next/server';

import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
  const { subscriptionId } = await req.json();

  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_LIVE_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
  });

  const subscription = await instance.subscriptions.cancel(subscriptionId);

  return NextResponse.json(subscription);
}
