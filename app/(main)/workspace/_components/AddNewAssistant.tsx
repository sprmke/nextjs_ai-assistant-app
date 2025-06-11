import React, { useContext, useState } from 'react';

import Image from 'next/image';

import { toast } from 'sonner';
import { Loader2Icon } from 'lucide-react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

import { aiAssistantsList } from '@/services/AiAssistantsList';
import { aiModelOptions } from '@/services/AiModelOptions';

import AssistantAvatar from '@/app/(main)/workspace/_components/AssistantAvatar';

import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';

import { AuthContext } from '@/context/AuthContext';

import { AiAssistant } from '@/app/(main)/types';

const DEFAULT_ASSISTANT = {
  image: '/bug-fixer.avif',
  name: '',
  title: '',
  instruction: '',
  id: '',
  sampleQuestions: [],
  userInstruction: '',
  aiModelId: 'google/gemini-2.0-flash',
} as unknown as AiAssistant;

function AddNewAssistant({
  children,
  onAddAssistant,
}: {
  children: React.ReactNode;
  onAddAssistant: () => void;
}) {
  const { user } = useContext(AuthContext);

  const addAssistants = useMutation(api.userAiAssistants.addAssistants);

  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssistant, setSelectedAssistant] =
    useState<AiAssistant>(DEFAULT_ASSISTANT);

  const {
    name,
    title,
    userInstruction,
    aiModelId = 'google/gemini-2.0-flash',
    image,
  } = selectedAssistant ?? {};

  const filteredAssistants = aiAssistantsList.filter(
    (assistant) =>
      assistant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assistant.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const onHandleInputChange = (key: string, value: string) => {
    setSelectedAssistant((prevAssistantInfo) => ({
      ...prevAssistantInfo,
      [key]: value,
    }));
  };

  const addAssistant = async () => {
    if (!user || !name || !title || !userInstruction) {
      return;
    }

    setIsLoading(true);
    await addAssistants({
      aiAssistants: [
        {
          ...selectedAssistant,
          id: crypto.randomUUID(),
          userId: user._id,
          aiModelId: aiModelId ?? 'google/gemini-2.0-flash',
        },
      ],
    });

    setSelectedAssistant(DEFAULT_ASSISTANT);
    setIsLoading(false);
    toast(`Successfully added ${name} as a new companion`);
    onAddAssistant();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-2">Add New Companion</DialogTitle>
          <DialogDescription asChild>
            <div className="grid grid-cols-3 gap-5 mt-5">
              <div className="flex flex-col gap-6 border-r pr-5">
                <div className="flex flex-col gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={() => setSelectedAssistant(DEFAULT_ASSISTANT)}
                  >
                    + Create custom companion
                  </Button>
                  <Input
                    placeholder="Search suggested companions"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <p>Suggested companions:</p>
                  <div className="flex flex-col max-h-[75vh] overflow-auto scrollbar-hide">
                    {filteredAssistants.map((assistant, index) => (
                      <div
                        className="p-1.5 hover:bg-secondary flex gap-2 items-center rounded-lg cursor-pointer"
                        key={index}
                        onClick={() =>
                          setSelectedAssistant(
                            assistant as unknown as AiAssistant
                          )
                        }
                      >
                        <Image
                          src={assistant.image}
                          width={40}
                          height={40}
                          alt={assistant.name}
                          className="w-[40px] h-[40px] object-cover rounded-lg"
                        />
                        <p className="text-sm">{assistant.title}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-span-2 flex flex-col gap-5">
                <div className="flex gap-5">
                  <AssistantAvatar
                    onAvatarSelect={(image) =>
                      onHandleInputChange('image', image)
                    }
                  >
                    <Image
                      src={image}
                      alt="assistant"
                      width={85}
                      height={85}
                      className="w-[85px] h-[85px] rounded-lg cursor-pointer object-cover hover:opacity-80 transition-opacity duration-200"
                    />
                  </AssistantAvatar>
                  <div className="flex flex-col gap-3 w-full">
                    <Input
                      placeholder="Name of Companion"
                      className="w-full"
                      value={selectedAssistant?.name}
                      onChange={(event) =>
                        onHandleInputChange('name', event.target.value)
                      }
                    />
                    <Input
                      placeholder="Title of Companion"
                      value={selectedAssistant?.title}
                      onChange={(event) =>
                        onHandleInputChange('title', event.target.value)
                      }
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <h2 className="text-gray-500">Model:</h2>
                  <Select
                    value={aiModelId}
                    onValueChange={(value) =>
                      onHandleInputChange('aiModelId', value)
                    }
                  >
                    <SelectTrigger className="w-full bg-white">
                      <SelectValue placeholder="Select Model" />
                    </SelectTrigger>
                    <SelectContent>
                      {aiModelOptions.map(({ id, logo, name }, index) => (
                        <SelectItem value={id} key={index}>
                          <div className="flex gap-2 items-center m-1">
                            <Image
                              src={logo}
                              alt={name}
                              width={20}
                              height={20}
                              className="rounded-md"
                            />
                            <h2>{name}</h2>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1 flex-1">
                  <h2 className="text-gray-500">Instructions:</h2>
                  <Textarea
                    placeholder="Add Instructions"
                    value={userInstruction}
                    className="min-h-[200px]"
                    onChange={(event) =>
                      onHandleInputChange('userInstruction', event.target.value)
                    }
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <DialogClose asChild>
                    <Button variant={'secondary'}>Cancel</Button>
                  </DialogClose>
                  <Button disabled={isLoading} onClick={addAssistant}>
                    {isLoading && <Loader2Icon className="animate-spin" />} Add
                  </Button>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default AddNewAssistant;
