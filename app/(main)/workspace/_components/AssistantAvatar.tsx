import React from 'react';

import Image from 'next/image';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { aiAssistantsList } from '@/services/AiAssistantsList';

function AssistantAvatar({
  children,
  onAvatarSelect,
}: {
  children: React.ReactNode;
  onAvatarSelect: (image: string) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent>
        <div className="grid grid-cols-5 gap-2">
          {aiAssistantsList.map(({ id, name, image }) => (
            <Image
              key={id}
              src={image}
              alt={name}
              width={50}
              height={50}
              className="w-[50px] h-[50px] rounded-lg cursor-pointer object-cover hover:opacity-80 transition-opacity duration-200"
              onClick={() => onAvatarSelect(image)}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default AssistantAvatar;
