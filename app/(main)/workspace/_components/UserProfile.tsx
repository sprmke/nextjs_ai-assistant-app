import React, { useContext, useEffect, useState } from 'react';

import Image from 'next/image';

import axios from 'axios';

import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';

import { WalletCardsIcon } from 'lucide-react';
import { Loader2Icon } from 'lucide-react';

import { toast } from 'sonner';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

import { AuthContext } from '@/context/AuthContext';

const PRO_PLAN_CREDITS = 10000;
const FREE_PLAN_CREDITS = 5000;

function UserProfile({
  openUserProfile,
  setOpenUserProfile,
}: {
  openUserProfile: boolean;
  setOpenUserProfile: (open: boolean) => void;
}) {
  const { user } = useContext(AuthContext);

  const updateUserTokens = useMutation(api.users.UpdateUserTokens);

  const [userMaxToken, setUserMaxToken] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUserMaxToken(user?.orderId ? PRO_PLAN_CREDITS : FREE_PLAN_CREDITS);
  }, [user?.orderId]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => console.log('Razorpay script loaded');
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const createSubscription = async () => {
    setIsLoading(true);
    const result = await axios.post('/api/create-subscription');
    setIsLoading(false);
    makePayment(result?.data?.id);
  };

  const cancelSubscription = async () => {
    const result = await axios.post('/api/cancel-subscription', {
      subscriptionId: user?.orderId,
    });
    console.log(result);
    toast('Subscription Canceled');
    window.location.reload();
  };

  const makePayment = async (subscriptionId?: string) => {
    if (!subscriptionId || !user) return;

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_LIVE_KEY,
      subscription_id: subscriptionId,
      name: 'AI Assistant App',
      description: 'AI Assistant App Subscription',
      image: '/logo.svg',
      handler: function (response: any) {
        if (!user._id || !response?.razorpay_payment_id) return;

        console.log(response);
        updateUserTokens({
          userId: user._id,
          credits: user.credits + PRO_PLAN_CREDITS,
          orderId: response.razorpay_payment_id,
        });
      },
      prefill: {
        name: user.name,
        email: user.email,
      },
      notes: {},
      theme: {
        color: '#000000',
      },
    };

    // @ts-ignore
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  return (
    <Dialog open={openUserProfile} onOpenChange={setOpenUserProfile}>
      <DialogContent>
        <DialogHeader className="hidden">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <div className="flex gap-4 items-center">
            <Image
              src={user?.picture ?? ''}
              alt="user"
              width={60}
              height={60}
              className="w-[60px] h-[60px] rounded-full"
            />
            <div>
              <div className="font-bold text-lg">{user?.name}</div>
              <div className="text-gray-500">{user?.email}</div>
            </div>
          </div>

          <hr className="my-5"></hr>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
              <p className="font-bold">Token Usage</p>
              <p>
                {user?.credits ?? 0}/{userMaxToken}
              </p>
              <Progress value={((user?.credits ?? 0) / userMaxToken) * 100} />
            </div>

            <div className="flex justify-between">
              <p className="font-bold text-lg">Current Plan</p>
              <span className="p-1 bg-gray-100 rounded-md px-2 font-normal">
                {!user?.orderId ? 'Free Plan' : 'Pro Plan'}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-3">
            {!user?.orderId ? (
              <div className="p-4 border rounded-xl mt-4">
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold text-lg">Pro Plan</p>
                    <p>10,000 Tokens</p>
                  </div>
                  <p className="font-bold text-lg flex items-center justify-center">
                    $10/month
                  </p>
                </div>
                <hr className="my-3" />
                <Button
                  className="w-full"
                  disabled={isLoading}
                  onClick={createSubscription}
                >
                  {isLoading ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    <WalletCardsIcon />
                  )}
                  Upgrade
                </Button>
              </div>
            ) : (
              <Button
                className="mt-4 w-full"
                variant="secondary"
                onClick={cancelSubscription}
              >
                Cancel Subscription
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UserProfile;
