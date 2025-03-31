import React from 'react';

import ChatUI from '@/app/(main)/workspace/_components/ChatUI';
import AssistantList from '@/app/(main)/workspace/_components/AssistantList';
import AssistantSettings from '@/app/(main)/workspace/_components/AssistantSettings';

function Workspace() {
  return (
    <div className="h-screen fixed w-full bg-white">
      <div className="grid md:grid-cols-5">
        <div className="hidden lg:block  col-span-1">
          <AssistantList />
        </div>
        <div className=" md:col-span-2 lg:col-span-3">
          <ChatUI />
        </div>
        <div className="hidden lg:block">
          <AssistantSettings />
        </div>
      </div>
    </div>
  );
}

export default Workspace;
