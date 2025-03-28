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

function AIAssistants() {
  const router = useRouter();
  const convex = useConvex();
  const { user } = useContext(AuthContext);

  const insertAssistant = useMutation(
    api.userAiAssistants.addSelectedAssistants
  );

  const [loading, setLoading] = useState(false);
  const [selectedAssistants, setSelectedAssistants] = useState<AiAssistants>(
    []
  );

  useEffect(() => {
    if (!user) return;

    getUserAssistants();
  }, [user]);

  const getUserAssistants = async () => {
    const userAssistants = await convex.query(
      api.userAiAssistants.getAllUserAssistants,
      {
        userId: user._id,
      }
    );
    console.log(userAssistants);

    if (userAssistants.length) {
      // Navigate to workspace page
      // router.replace('/workspace');
    }
  };

  const isAssistantSelected = (assistant: AiAssistant) => {
    return !!selectedAssistants.find(({ id }) => id == assistant.id);
  };

  const onSelect = (assistant: AiAssistant) => {
    const item = selectedAssistants.find(({ id }) => id == assistant.id);

    if (item) {
      setSelectedAssistants(
        selectedAssistants.filter(({ id }) => id !== assistant.id)
      );
      return;
    }

    setSelectedAssistants((prevAssistants) => [...prevAssistants, assistant]);
  };

  const onClickContinue = async () => {
    setLoading(true);
    const result = await insertAssistant({
      aiAssistants: selectedAssistants.map((aiAssistant) => ({
        ...aiAssistant,
        userId: user?._id,
        aiModelId: 'Google: Gemini 2.0 Flash',
      })),
    });
    setLoading(false);
    router.replace('/workspace');
    console.log(result);
  };

  return (
    <div className="px-10 mt-20 md:px-28 lg:px-36 xl:px-48">
      <div className="flex justify-between items-center">
        <div>
          <BlurFade delay={0.25} inView>
            <h2 className="text-3xl font-bold">
              Welcome to the World of AI Assistants 🤖
            </h2>
          </BlurFade>
          <BlurFade delay={0.25 * 2} inView>
            <p className="text-xl mt-2">
              Choose your AI Campanion to Simplify Your Task 🚀
            </p>
          </BlurFade>
        </div>
        <RainbowButton
          disabled={selectedAssistants?.length == 0 || loading}
          onClick={onClickContinue}
        >
          {' '}
          {loading && <Loader2Icon className="animate-spin" />} Continue
        </RainbowButton>
      </div>

      <div
        className="grid grid-cols-2 md:grid-cols-3 
        lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-5"
      >
        {aiAssistantsList.map((assistant, index) => (
          <BlurFade key={assistant.image} delay={0.25 + index * 0.05} inView>
            <div
              key={index}
              className="hover:border p-3 rounded-xl hover:scale-105 
                transition-all ease-in-out cursor-pointer relative"
              onClick={() => onSelect(assistant as AiAssistant)}
            >
              <Checkbox
                className="absolute m-2"
                checked={isAssistantSelected(assistant as AiAssistant)}
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
