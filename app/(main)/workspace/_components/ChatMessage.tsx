import { Loader2Icon } from 'lucide-react';
import Image from 'next/image';

type ChatMessageProps = {
  role: 'user' | 'assistant';
  content: string;
  assistantImage?: string;
  isLoading?: boolean;
};

function ChatMessage({
  role,
  content,
  assistantImage,
  isLoading,
}: ChatMessageProps) {
  return (
    <div
      className={`flex mb-2 ${role === 'user' ? 'justify-end' : 'justify-start'}`}
    >
      <div className="flex gap-3">
        {role === 'assistant' && assistantImage && (
          <Image
            src={assistantImage}
            alt="Assistant"
            width={100}
            height={100}
            className="w-[50px] h-[50px] rounded-full object-cover"
          />
        )}
        <div
          className={`flex items-center gap-2 p-3 text-black rounded-lg ${
            role === 'user' ? 'bg-gray-200' : 'bg-gray-50'
          }`}
        >
          {isLoading && <Loader2Icon className="w-4 h-4 animate-spin" />}
          <p>{content}</p>
        </div>
      </div>
    </div>
  );
}

export default ChatMessage;
