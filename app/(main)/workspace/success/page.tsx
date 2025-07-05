'use client';

import { useContext, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { AuthContext } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function SuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setUser } = useContext(AuthContext);
  const updateUserTokens = useMutation(api.users.UpdateUserTokens);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (sessionId && user) {
      // Verify the session and update user credits
      const verifySession = async () => {
        try {
          const response = await fetch('/api/retrieve-session', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ sessionId }),
          });

          if (response.ok) {
            const session = await response.json();

            if (session.payment_status === 'paid' && session.subscription) {
              // Update user credits and subscription ID
              await updateUserTokens({
                userId: user._id,
                credits: user.credits + 10000, // PRO_PLAN_CREDITS
                orderId: session.subscription,
              });

              // Update local user state
              setUser({
                ...user,
                credits: user.credits + 10000,
                orderId: session.subscription,
              });

              toast.success(
                'Payment successful! Your credits have been updated.'
              );
            }
          }
        } catch (error) {
          console.error('Error verifying session:', error);
          toast.error('There was an issue verifying your payment.');
        }
      };

      verifySession();
    }

    // Redirect back to workspace after a short delay
    const timer = setTimeout(() => {
      router.push('/workspace');
    }, 3000);

    return () => clearTimeout(timer);
  }, [searchParams, user, router, setUser, updateUserTokens]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-4">
          Thank you for your purchase. Your credits have been updated.
        </p>
        <p className="text-sm text-gray-500">
          Redirecting you back to the workspace...
        </p>
      </div>
    </div>
  );
}
