'use client';

import { Fragment, useContext, useEffect, useState } from 'react';

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

// Type for the static assistant list items
type StaticAssistant = Omit<AiAssistant, '_id' | 'userId' | 'aiModelId'>;

function AIAssistants() {
  const router = useRouter();
  const convex = useConvex();
  const { user } = useContext(AuthContext);

  const addAssistants = useMutation(api.userAiAssistants.addAssistants);

  const [isLoading, setIsLoading] = useState(true);
  const [isContinueDisabled, setIsContinueDisabled] = useState(false);
  const [selectedAssistants, setSelectedAssistants] = useState<
    StaticAssistant[]
  >([]);
  const [availableAssistants, setAvailableAssistants] = useState<
    StaticAssistant[]
  >([]);

  useEffect(() => {
    // Disable continue button if no assistants are selected and all assistants are available
    setIsContinueDisabled(
      !selectedAssistants.length &&
        availableAssistants.length === aiAssistantsList.length
    );
  }, [selectedAssistants, availableAssistants]);

  useEffect(() => {
    if (!user?._id) return;

    getUserAssistants();
  }, [user]);

  const getUserAssistants = async () => {
    if (!user?._id) return;

    setIsLoading(true);
    const userAssistants = await convex.query(
      api.userAiAssistants.getAllUserAssistants,
      {
        userId: user._id,
      }
    );

    // Filter out assistants that user already has
    const filteredAssistants = aiAssistantsList.filter(
      (assistant) => !userAssistants.some(({ id }) => id === assistant.id)
    );

    setAvailableAssistants(filteredAssistants);
    setIsLoading(false);
  };

  const isAssistantSelected = (assistant: StaticAssistant) => {
    return !!selectedAssistants.find(({ id }) => id === assistant.id);
  };

  const selectAssistant = (assistant: StaticAssistant) => {
    const item = selectedAssistants.find(({ id }) => id === assistant.id);

    if (item) {
      setSelectedAssistants(
        selectedAssistants.filter(({ id }) => id !== assistant.id)
      );
      return;
    }

    setSelectedAssistants((prevAssistants) => [...prevAssistants, assistant]);
  };

  const saveSelectedAssistants = async () => {
    if (!user?._id) return;
    setIsLoading(true);
    await addAssistants({
      aiAssistants: selectedAssistants.map((assistant) => ({
        ...assistant,
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
      {availableAssistants.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <BlurFade delay={0.25} inView>
            <h2 className="text-2xl font-bold text-center mb-6">
              All suggested companions are already selected!
            </h2>
          </BlurFade>
          <BlurFade delay={0.35} inView>
            <RainbowButton onClick={() => router.replace('/workspace')}>
              Go to workspace
            </RainbowButton>
          </BlurFade>
        </div>
      ) : (
        <Fragment>
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
              disabled={isContinueDisabled}
              onClick={saveSelectedAssistants}
            >
              {isLoading && !isContinueDisabled && (
                <Loader2Icon className="animate-spin" />
              )}{' '}
              Continue
            </RainbowButton>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 mt-10">
            {availableAssistants.map((assistant, index) => (
              <BlurFade key={index} delay={0.25 + index * 0.05} inView>
                <div
                  className="hover:border p-3 rounded-xl hover:scale-105 
                  transition-all ease-in-out cursor-pointer relative"
                  onClick={() => selectAssistant(assistant)}
                >
                  <Checkbox
                    className="absolute m-2"
                    checked={isAssistantSelected(assistant)}
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
        </Fragment>
      )}
    </div>
  );
}

export default AIAssistants;
