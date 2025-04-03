import React from 'react';
import MainProvider from '@/app/(main)/mainProvider';

function WorkspaceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <MainProvider>{children}</MainProvider>
    </div>
  );
}

export default WorkspaceLayout;
