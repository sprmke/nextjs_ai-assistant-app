'use client';

import React, { useContext } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useGoogleLogin } from '@react-oauth/google';

import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

import { AuthContext } from '@/context/AuthContext';
import { GetAuthUserData } from '@/services/GlobalApi';

import { Button } from '@/components/ui/button';

import { User } from '@/app/(main)/types';

function SignIn() {
  const CreateUser = useMutation(api.users.CreateUser);
  const { setUser } = useContext(AuthContext);

  const router = useRouter();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_token', tokenResponse.access_token);
      }

      const { name, email, picture } = await GetAuthUserData(
        tokenResponse.access_token
      );

      // Save User Info
      const newUser = await CreateUser({
        name,
        email,
        picture,
      });

      setUser(newUser as User);

      // Redirect to home page
      router.replace('/assistants');
    },
    onError: (errorResponse) => console.error(errorResponse),
  });

  return (
    <div className="flex items-center flex-col justify-center h-screen px-5">
      <div className="flex flex-col items-center gap-5 border rounded-2xl p-10 shadow-md w-full md:w-[400px]">
        <Image src={'/logo.svg'} alt="App Logo" width={50} height={50} />
        <h2 className="text-2xl">Sign In</h2>

        <Button
          onClick={() => googleLogin()}
          className="flex items-center gap-2"
        >
          <Image src="/google.png" alt="Google" width={20} height={20} />
          Sign in with Google
        </Button>
      </div>
    </div>
  );
}

export default SignIn;
