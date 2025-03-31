import React from 'react';
import Provider from '@/app/(main)/mainProvider';

function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Provider>{children}</Provider>
    </div>
  );
}

export default WorkspaceLayout;
