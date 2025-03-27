import React from 'react';

import AssistantList from './_components/AssistantList';
import AssistantSettings from './_components/AssistantSettings';

import ChatUi from './_components/ChatUi';

function Workspace() {
  return (
    <div className="h-screen fixed w-full">
      <div className="grid md:grid-cols-5">
        <div className="hidden lg:block  col-span-1">
          <AssistantList />
        </div>
        <div className=" md:col-span-2 lg:col-span-3">{/* Chat UI */}</div>
        <div className="hidden lg:block">{/* Assistant Settings */}</div>
      </div>
    </div>
  );
}

export default Workspace;
