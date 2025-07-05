'use client';

import { useContext, useEffect, Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { AuthContext } from '@/context/AuthContext';
import { toast } from 'sonner';

function SuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setUser } = useContext(AuthContext);
  const updateUserTokens = useMutation(api.users.UpdateUserTokens);
  const [isChecking, setIsChecking] = useState(true);

  // Get the latest user data
  const currentUser = useQuery(api.users.GetUser, { email: user?.email || '' });

  useEffect(() => {
    const checkAndUpdateCredits = async () => {
      if (!user || !currentUser) return;

      // Check if credits were already updated by webhook
      const creditsWereUpdated = currentUser.credits > user.credits;

      if (!creditsWereUpdated) {
        console.log('Credits not updated by webhook, attempting manual update');

        // Try to update credits manually (fallback)
        try {
          await updateUserTokens({
            userId: user._id,
            credits: user.credits + 10000, // PRO_PLAN_CREDITS
            orderId: currentUser.orderId || 'manual_update',
          });

          // Update local user state
          setUser({
            ...user,
            credits: user.credits + 10000,
            orderId: currentUser.orderId || 'manual_update',
          });

          toast.success('Payment successful! Your credits have been updated.');
        } catch (error) {
          console.error('Error updating credits manually:', error);
          toast.error(
            'Payment successful, but there was an issue updating your credits. Please contact support.'
          );
        }
      } else {
        console.log('Credits already updated by webhook');
        toast.success('Payment successful! Your credits have been updated.');
      }

      setIsChecking(false);
    };

    // Wait a bit for webhook to process, then check
    const timer = setTimeout(checkAndUpdateCredits, 2000);

    return () => clearTimeout(timer);
  }, [user, currentUser, updateUserTokens, setUser]);

  useEffect(() => {
    if (!isChecking) {
      // Redirect back to workspace after checking is complete
      const timer = setTimeout(() => {
        router.push('/workspace');
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isChecking, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-4">
          Thank you for your purchase. Your credits have been updated.
        </p>
        {isChecking && (
          <p className="text-sm text-gray-500 mb-4">
            Verifying your payment...
          </p>
        )}
        <p className="text-sm text-gray-500">
          Redirecting you back to the workspace...
        </p>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Processing Payment...</h1>
        <p className="text-gray-600 mb-4">
          Please wait while we verify your payment.
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessPageContent />
    </Suspense>
  );
}
