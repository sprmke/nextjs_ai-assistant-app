import React, { useContext, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { AuthContext } from '@/context/AuthContext';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { WalletCardsIcon } from 'lucide-react';
import { Loader2Icon } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

function UserProfile({
  openUserProfile,
  setOpenUserProfile,
}: {
  openUserProfile: boolean;
  setOpenUserProfile: (open: boolean) => void;
}) {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

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
              src={user?.picture}
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
              <p>0/0</p>
              <Progress value={33} />
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
                    <p>500,000 Tokens</p>
                  </div>
                  <p className="font-bold text-lg flex items-center justify-center">
                    $10/month
                  </p>
                </div>
                <hr className="my-3" />
                <Button className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    <WalletCardsIcon />
                  )}
                  Upgrade
                </Button>
              </div>
            ) : (
              <Button className="mt-4 w-full" variant="secondary">
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
