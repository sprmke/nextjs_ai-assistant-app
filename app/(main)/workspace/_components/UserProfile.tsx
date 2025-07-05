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

  const userCredits = (user?.credits ?? 0) >= 0 ? (user?.credits ?? 0) : 0;

  const updateUserTokens = useMutation(api.users.UpdateUserTokens);

  const [userMaxToken, setUserMaxToken] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUserMaxToken(user?.orderId ? PRO_PLAN_CREDITS : FREE_PLAN_CREDITS);
  }, [user?.orderId]);

  const createCheckoutSession = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // First, create or get customer
      const customerResponse = await axios.post('/api/create-customer', {
        email: user.email,
        name: user.name,
      });

      const customerId = customerResponse.data.id;

      // Create checkout session
      const sessionResponse = await axios.post('/api/create-checkout-session', {
        customerId,
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
        successUrl: `${window.location.origin}/workspace/success`,
        cancelUrl: `${window.location.origin}/workspace`,
      });

      // Redirect to Stripe Checkout
      window.location.href = sessionResponse.data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error('Failed to create checkout session');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async () => {
    try {
      await axios.post('/api/cancel-subscription', {
        subscriptionId: user?.orderId,
      });
      toast.success(
        'Subscription will be canceled at the end of the current period'
      );
      window.location.reload();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast.error('Failed to cancel subscription');
    }
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
                {userCredits}/{userMaxToken}
              </p>
              <Progress value={(userCredits / userMaxToken) * 100} />
            </div>

            <div className="flex justify-between">
              <p className="font-semibold text-lg">Current Plan</p>
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
                  onClick={createCheckoutSession}
                >
                  {isLoading ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    <WalletCardsIcon />
                  )}
                  Upgrade Plan
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
