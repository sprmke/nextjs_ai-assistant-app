'use client';

import React, { Fragment, useContext, useEffect, useState } from 'react';

import Image from 'next/image';

import { Loader2, LogOut, UserCircle2 } from 'lucide-react';

import { BlurFade } from '@/components/magicui/blur-fade';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import AddNewAssistant from '@/app/(main)/workspace/_components/AddNewAssistant';

import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';

import { AuthContext } from '@/context/AuthContext';
import { AssistantContext } from '@/context/AssistantContext';

import type { AiAssistants } from '@/app/(main)/types';

import UserProfile from '@/app/(main)/workspace/_components/UserProfile';
import { googleLogout } from '@react-oauth/google';
import { useRouter } from 'next/navigation';

function AssistantList() {
  const convex = useConvex();
  const router = useRouter();

  const { user, setUser } = useContext(AuthContext);
  const { assistant, setAssistant } = useContext(AssistantContext);

  const [assistants, setAssistants] = useState<AiAssistants>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openUserProfile, setOpenUserProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!user?._id || assistant) return;

    getUserAssistants();
  }, [user, assistant === null]);

  const getUserAssistants = async () => {
    if (!user?._id) return;
    setIsLoading(true);
    setAssistants([]);

    const assistants = await convex.query(
      api.userAiAssistants.getAllUserAssistants,
      {
        userId: user._id,
      }
    );

    if (!assistants.length) {
      router.push('/assistants');
      return;
    }

    const [assistant] = assistants ?? [];

    setAssistant(assistant);
    setAssistants(assistants);
    setIsLoading(false);
  };

  const filteredAssistants = assistants.filter(
    (assistant) =>
      assistant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assistant.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    // Revoke Google OAuth token
    googleLogout();

    // Clear user from context
    setUser(null);

    // Redirect to sign-in page
    router.replace('/sign-in');
  };

  return (
    <div className="flex flex-col p-5 bg-secondary border-r-[1px] h-[calc(100vh-64px)]">
      <AddNewAssistant onAddAssistant={getUserAssistants}>
        <Button className="w-full">+ Add New Companion</Button>
      </AddNewAssistant>

      <Input
        className="bg-white mt-3"
        placeholder="Search assistant"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <div className="my-3 overflow-y-auto scrollbar-hide flex-1">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin opacity-25" />
          </div>
        ) : (
          filteredAssistants.map((_assistant, index) => (
            <BlurFade key={index} delay={0.25 + index * 0.05} inView>
              <div
                className={`p-2 flex gap-3 items-center hover:bg-gray-200 hover:dark:bg-slate-700 rounded-xl cursor-pointer mt-2 ${_assistant.id == assistant?.id && 'bg-gray-200'}`}
                onClick={() => {
                  setAssistant(_assistant);
                }}
              >
                <Image
                  src={_assistant.image}
                  alt={_assistant.name}
                  width={60}
                  height={60}
                  className="rounded-xl w-[60px] h-[60px] object-cover"
                />
                <div>
                  <h2 className="font-bold">{_assistant.name}</h2>
                  <h2 className="text-gray-600 text-sm dark:text-gray-300">
                    {_assistant.title}
                  </h2>
                </div>
              </div>
            </BlurFade>
          ))
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex gap-3 items-center hover:bg-gray-200 w-full p-2 rounded-xl cursor-pointer bg-secondary">
            {user ? (
              <Fragment>
                <Image
                  src={user?.picture}
                  alt="user"
                  width={35}
                  height={35}
                  className="rounded-full"
                />
                <div className="flex flex-col">
                  <h2 className="font-bold">{user?.name}</h2>
                  <h2 className="text-gray-400 text-sm">
                    {user?.orderId ? 'Pro Plan' : 'Free Plan'}
                  </h2>
                </div>
              </Fragment>
            ) : (
              <div className="flex justify-center items-center w-full min-h-[45px]">
                <Loader2 className="animate-spin opacity-25" />
              </div>
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]" align="start">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => setOpenUserProfile(true)}
          >
            <UserCircle2 />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={handleLogout}>
            <LogOut />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UserProfile
        openUserProfile={openUserProfile}
        setOpenUserProfile={setOpenUserProfile}
      />
    </div>
  );
}

export default AssistantList;
