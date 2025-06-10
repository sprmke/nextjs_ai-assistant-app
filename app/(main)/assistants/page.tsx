'use client';

import { useContext, useEffect, useState } from 'react';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { Loader2Icon } from 'lucide-react';

import { useConvex, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

import { BlurFade } from '@/components/magicui/blur-fade';
import { RainbowButton } from '@/components/magicui/rainbow-button';
import { Checkbox } from '@/components/ui/checkbox';

import { AuthContext } from '@/context/AuthContext';

import { aiAssistantsList } from '@/services/AiAssistantsList';
import { AiAssistant, AiAssistants } from '@/app/(main)/types';

import Hero from '../_components/Hero';

function AIAssistants() {
  const router = useRouter();
  const convex = useConvex();
  const { user } = useContext(AuthContext);

  const addAssistants = useMutation(api.userAiAssistants.addAssistants);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedAssistants, setSelectedAssistants] = useState<AiAssistants>(
    []
  );

  useEffect(() => {
    if (!user) return;

    getUserAssistants();
  }, [user]);

  const getUserAssistants = async () => {
    if (!user) return;

    setIsLoading(true);
    const userAssistants = await convex.query(
      api.userAiAssistants.getAllUserAssistants,
      {
        userId: user._id,
      }
    );

    if (userAssistants.length) {
      router.replace('/workspace');
    } else {
      setIsLoading(false);
    }
  };

  const isAssistantSelected = (assistant: AiAssistant) => {
    return !!selectedAssistants.find(({ id }) => id == assistant.id);
  };

  const selectAssistant = (assistant: AiAssistant) => {
    const item = selectedAssistants.find(({ id }) => id == assistant.id);

    if (item) {
      setSelectedAssistants(
        selectedAssistants.filter(({ id }) => id !== assistant.id)
      );
      return;
    }

    setSelectedAssistants((prevAssistants) => [...prevAssistants, assistant]);
  };

  const saveSelectedAssistants = async () => {
    if (!user) return;
    setIsLoading(true);
    await addAssistants({
      aiAssistants: selectedAssistants.map((aiAssistant) => ({
        ...aiAssistant,
        userId: user._id,
        aiModelId: 'google/gemini-2.0-flash',
      })),
    });
    setIsLoading(false);
    router.replace('/workspace');
  };

  return isLoading ? (
    <div className="flex h-screen w-screen items-center justify-center">
      <Loader2Icon className="animate-spin" size={35} />
    </div>
  ) : (
    <div className="px-10 mt-[64px] md:px-28 lg:px-36 xl:px-48 py-10">
      <div className="flex justify-between items-center">
        <div>
          <BlurFade delay={0.25} inView>
            <h2 className="text-3xl font-bold">
              Welcome to the space of AI Companions!
            </h2>
          </BlurFade>
          <BlurFade delay={0.25 * 2} inView>
            <p className="text-xl mt-2">
              Choose your AI companion to simplify your tasks 🚀
            </p>
          </BlurFade>
        </div>
        <RainbowButton
          disabled={selectedAssistants?.length == 0 || isLoading}
          onClick={saveSelectedAssistants}
        >
          {isLoading && <Loader2Icon className="animate-spin" />} Continue
        </RainbowButton>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-10">
        {aiAssistantsList.map((assistant, index) => (
          <BlurFade key={index} delay={0.25 + index * 0.05} inView>
            <div
              className="hover:border p-3 rounded-xl hover:scale-105 
                transition-all ease-in-out cursor-pointer relative"
              onClick={() => selectAssistant(assistant as AiAssistant)}
            >
              <Checkbox
                className="absolute m-2"
                checked={isAssistantSelected(assistant as AiAssistant)}
                variant="custom"
                customColor="#ef4138"
              />
              <Image
                src={assistant.image}
                alt={assistant.title}
                width={600}
                height={600}
                className="rounded-xl w-full h-[200px] object-cover"
              />
              <h2 className="text-center font-bold text-lg">
                {assistant.name}
              </h2>
              <h2 className="text-center text-gray-600 dark:text-gray-300">
                {assistant.title}
              </h2>
            </div>
          </BlurFade>
        ))}
      </div>
    </div>
  );
}

export default AIAssistants;
