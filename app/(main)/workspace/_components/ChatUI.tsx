'use client';

import { useContext, useEffect, useRef, useState } from 'react';

import axios from 'axios';

import { Send } from 'lucide-react';

import AiModelOptions from '@/services/AiModelOptions';

import { AssistantContext } from '@/context/AssistantContext';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import ChatEmptyUI from '@/app/(main)/workspace/_components/ChatEmptyUI';
import ChatMessage from '@/app/(main)/workspace/_components/ChatMessage';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

function ChatUI() {
  const { assistant, setAssistant } = useContext(AssistantContext);

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

    const model = AiModelOptions.find(
      ({ name }) => name === assistant.aiModelId
    );

    // Clear the input field immediately after sending the message
    setMessage('');

    const result = await axios.post('/api/eden-ai-model', {
      modelId: model?.id,
      userMessage: message,
      prevAssistantMessage: messages[messages?.length - 1]?.content,
    });
    console.log(result.data);

    setMessages((prevMessages) => [...prevMessages, { ...result.data }]);
    setIsLoading(false);
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
                role === 'assistant' ? assistant.image : undefined
              }
            />
          ))}
          {isLoading && (
            <ChatMessage
              role="assistant"
              content="Loading..."
              assistantImage={assistant.image}
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
