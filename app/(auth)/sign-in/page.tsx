'use client';

import React from 'react';
import Image from 'next/image';

import axios from 'axios';

import { Button } from '@/components/ui/button';
import { useGoogleLogin } from '@react-oauth/google';
import { GetAuthUserData } from '@/services/GlobalApi';

function SignIn() {
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);

      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', tokenResponse.access_token);
      }

      const user = await GetAuthUserData(tokenResponse.access_token);
      console.log(user);
    },
    onError: (errorResponse) => console.log(errorResponse),
  });

  return (
    <div className="flex items-center flex-col justify-center h-screen">
      <div
        className="flex flex-col items-center
        gap-5 border rounded-2xl p-10 shadow-md"
      >
        <Image src={'/logo.svg'} alt="logo" width={50} height={50} />
        <h2 className="text-2xl">Sign In To AI Personal Assistant</h2>

        <Button onClick={() => googleLogin()}>Sign in With Gmail</Button>
      </div>
    </div>
  );
}

export default SignIn;
