'use client';

import { useContext, useEffect, useRef, useState } from 'react';

import axios from 'axios';

import { Send } from 'lucide-react';

import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

import { AssistantContext } from '@/context/AssistantContext';
import { AuthContext } from '@/context/AuthContext';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import ChatEmptyUI from '@/app/(main)/workspace/_components/ChatEmptyUI';
import ChatMessage from '@/app/(main)/workspace/_components/ChatMessage';

import { aiModelOptions } from '@/services/AiModelOptions';
import { User } from '@/app/(main)/types';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

function ChatUI() {
  const { assistant } = useContext(AssistantContext);
  const { user, setUser } = useContext(AuthContext);

  const updateUserTokens = useMutation(api.users.UpdateUserTokens);

  const scrollRef = useRef<HTMLDivElement>(null);

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Scroll to the bottom of the chat when new messages are added
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  useEffect(() => {
    setMessages([]);
  }, [assistant?.id]);

  const onSendMessage = async () => {
    setIsLoading(true);
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: message },
    ]);

    const model = aiModelOptions.find(({ id }) => id === assistant?.aiModelId);

    // Clear the input field immediately after sending the message
    setMessage('');

    const result = await axios.post('/api/eden-ai-model', {
      modelId: model?.id,
      userMessage: message,
      prevAssistantMessage: messages[messages?.length - 1]?.content,
    });

    setIsLoading(false);
    setMessages((prevMessages) => [...prevMessages, { ...result.data }]);
    updateUserCredits(result.data.content);
  };

  const updateUserCredits = async (contentMessage: string = '') => {
    if (!user) return;

    const tokenCount = contentMessage
      ? contentMessage.trim().split(/\s+/).length
      : 0;

    const credits = user?.credits - tokenCount;

    await updateUserTokens({
      userId: user?._id,
      credits,
    });

    setUser({
      ...user,
      credits,
    });
  };

  return (
    <div className="flex flex-col h-full">
      {!messages?.length ? (
        <ChatEmptyUI />
      ) : (
        <div
          ref={scrollRef}
          className="p-6 flex flex-col flex-1 max-h-[calc(100vh-76px)] overflow-y-auto scrollbar-hide"
        >
          {messages.map(({ role, content }, index) => (
            <ChatMessage
              key={index}
              role={role}
              content={content}
              assistantImage={
                role === 'assistant' ? assistant?.image : undefined
              }
            />
          ))}
          {isLoading && (
            <ChatMessage
              role="assistant"
              content="Loading..."
              assistantImage={assistant?.image}
              isLoading={true}
            />
          )}
        </div>
      )}

      <div className="flex justify-between p-5 gap-2">
        <Input
          value={message}
          disabled={isLoading}
          placeholder="Type your message here..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && onSendMessage()}
        />
        <Button disabled={isLoading} onClick={onSendMessage}>
          <Send />
        </Button>
      </div>
    </div>
  );
}

export default ChatUI;
