'use client';

import React, { useContext, useEffect, useState } from 'react';

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

function AssistantList() {
  const convex = useConvex();

  const { user } = useContext(AuthContext);
  const { assistant, setAssistant } = useContext(AssistantContext);

  const [assistants, setAssistants] = useState<AiAssistants>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openUserProfile, setOpenUserProfile] = useState(false);

  useEffect(() => {
    if (!user || assistant) return;

    getUserAssistants();
  }, [user, assistant]);

  const getUserAssistants = async () => {
    if (!user) return;
    setIsLoading(true);
    setAssistants([]);

    const assistants = await convex.query(
      api.userAiAssistants.getAllUserAssistants,
      {
        userId: user._id,
      }
    );

    const [assistant] = assistants ?? [];

    setAssistant(assistant);
    setAssistants(assistants);
    setIsLoading(false);
  };

  return (
    <div className="p-5 bg-secondary border-r-[1px] h-screen relative">
      <h2 className="font-bold text-lg">Your Personal AI Assistants</h2>

      <AddNewAssistant onAddAssistant={getUserAssistants}>
        <Button className="w-full mt-3">+ Add New Assistant</Button>
      </AddNewAssistant>

      <Input className="bg-white mt-3" placeholder="Search assistant" />

      <div className="mt-5 overflow-auto h-[64%]">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="animate-spin opacity-25" />
          </div>
        ) : (
          assistants.map((_assistant, index) => (
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

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="absolute bottom-10 flex gap-3 items-center hover:bg-gray-200 w-[87%] p-2 rounded-xl cursor-pointer bg-secondary">
              {user && (
                <Image
                  src={user?.picture}
                  alt="user"
                  width={35}
                  height={35}
                  className="rounded-full"
                />
              )}
              <div>
                <h2 className="font-bold">{user?.name}</h2>
                <h2 className="text-gray-400 text-sm">
                  {user?.orderId ? 'Pro Plan' : 'Free Plan'}
                </h2>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px]">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setOpenUserProfile(true)}>
              <UserCircle2 />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
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
    </div>
  );
}

export default AssistantList;
