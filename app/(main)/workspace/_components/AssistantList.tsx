'use client';

import React, { useContext, useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { BlurFade } from '@/components/magicui/blur-fade';

import { useConvex } from 'convex/react';
import { api } from '@/convex/_generated/api';

import { AuthContext } from '@/context/AuthContext';
import { AssistantContext } from '@/context/AssistantContext';

import type { Assistants } from '@/app/(main)/types';

function AssistantList() {
  const router = useRouter();
  const convex = useConvex();

  const { user, setUser } = useContext(AuthContext);
  const { assistant, setAssistant } = useContext(AssistantContext);

  const [assistants, setAssistants] = useState<Assistants>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    getUserAssistants();
  }, [user && assistant == null]);

  const getUserAssistants = async () => {
    setLoading(true);
    setAssistants([]);

    const assistants = await convex.query(
      api.userAiAssistants.GetAllUserAssistants,
      {
        userId: user._id,
      }
    );
    console.log(assistants);

    const [assistant] = assistants ?? [];

    setAssistant(assistant);
    setAssistants(assistants);
    setLoading(false);
  };

  return (
    <div className="p-5 bg-secondary border-r-[1px] h-screen relative">
      <h2 className="font-bold text-lg">Your Personal AI Assistants</h2>

      <Button className="w-full mt-3">+ Add New Assistant</Button>

      <Input className="bg-white mt-3" placeholder="Search assistant" />

      <div className="mt-5 overflow-scroll h-[64%]">
        {assistants.map((_assistant, index) => (
          <BlurFade key={_assistant.image} delay={0.25 + index * 0.05} inView>
            <div
              className={`p-2 flex gap-3 items-center
                    hover:bg-gray-200 hover:dark:bg-slate-700 
                    rounded-xl cursor-pointer mt-2
                    ${_assistant.id == assistant?.id && 'bg-gray-200'}
                    `}
              key={index}
              onClick={() => {
                setAssistant(_assistant);
              }}
            >
              <Image
                src={_assistant.image}
                alt={_assistant.name}
                width={60}
                height={60}
                className="rounded-xl w-[60px] h-[60px]
                            object-cover"
              />
              <div>
                <h2 className="font-bold">{_assistant.name}</h2>
                <h2 className="text-gray-600 text-sm dark:text-gray-300">
                  {_assistant.title}
                </h2>
              </div>
            </div>
          </BlurFade>
        ))}

        <div
          className="absolute bottom-10 flex gap-3 items-center
             hover:bg-gray-200 w-[87%] p-2 rounded-xl cursor-pointer bg-secondary"
        >
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
      </div>
    </div>
  );
}

export default AssistantList;
