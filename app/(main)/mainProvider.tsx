'use client';

import React, { useContext, useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { GetAuthUserData } from '@/services/GlobalApi';

import Header from '@/app/(main)/_components/Header';
import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';

import { AuthContext } from '@/context/AuthContext';
import { AssistantContext } from '@/context/AssistantContext';

import type { AiAssistant } from '@/app/(main)/types';

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const convex = useConvex();
  const { setUser } = useContext(AuthContext);
  const [assistant, setAssistant] = useState<AiAssistant | null>(null);

  useEffect(() => {
    CheckUseAuth();
  }, []);

  const CheckUseAuth = async () => {
    // Get user token from local storage
    const token = localStorage.getItem('user_token');

    // Get new access token
    const user = token ? await GetAuthUserData(token) : null;

    // If user is not logged in, redirect to sign-in page
    if (!user?.email) {
      router.replace('/sign-in');
      return;
    }

    // Get User Info From Database
    try {
      const result = await convex.query(api.users.GetUser, {
        email: user?.email,
      });

      if (result) {
        setUser(result);
      } else {
        console.error('User not found in database');
        router.replace('/sign-in');
      }
    } catch (error) {
      console.error('CheckUseAuth error::', error);
      router.replace('/sign-in');
    }
  };

  return (
    <div>
      <AssistantContext.Provider value={{ assistant, setAssistant }}>
        <Header />
        {children}
      </AssistantContext.Provider>
    </div>
  );
}

export default Provider;
