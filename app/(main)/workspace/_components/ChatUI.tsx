'use client';

import { useState } from 'react';

import { Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import ChatEmptyUI from '@/app/(main)/workspace/_components/ChatEmptyUI';

function ChatUI() {
  const [message, setMessage] = useState('');

  const onSendMessage = () => {
    console.log(message);
  };

  return (
    <div className="flex flex-col h-full">
      <ChatEmptyUI />

      <div className="flex justify-between p-5 gap-2">
        <Input
          placeholder="Type your message here..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={(e) => e.key === 'Enter' && onSendMessage()}
        />
        <Button>
          <Send />
        </Button>
      </div>
    </div>
  );
}

export default ChatUI;
