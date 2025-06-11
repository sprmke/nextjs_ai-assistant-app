import React, { useContext } from 'react';

import { ChevronRight } from 'lucide-react';

import { SparklesText } from '@/components/magicui/sparkles-text';

import { AssistantContext } from '@/context/AssistantContext';
import { BlurFade } from '@/components/magicui/blur-fade';

interface ChatEmptyUIProps {
  onSuggestionClick: (suggestion: string) => void;
}

function ChatEmptyUI({ onSuggestionClick }: ChatEmptyUIProps) {
  const { assistant } = useContext(AssistantContext);

  return (
    <div className="flex flex-col items-center justify-center flex-1 max-h-[calc(100vh-76px-64px)] overflow-y-auto scrollbar-hide">
      <SparklesText
        className="text-4xl text-center"
        text="How can I assist you?"
      />

      <div className="mt-7">
        {assistant?.sampleQuestions?.map(
          (suggestion: string, index: number) => (
            <BlurFade key={index} delay={0.2 * index}>
              <h2
                onClick={() => onSuggestionClick(suggestion)}
                className="flex items-center justify-between p-4 text-lg border rounded-xl mt-1 hover:bg-gray-100 cursor-pointer gap-10"
              >
                {suggestion}
                <ChevronRight className="w-4 h-4" />
              </h2>
            </BlurFade>
          )
        )}
      </div>
    </div>
  );
}

export default ChatEmptyUI;
