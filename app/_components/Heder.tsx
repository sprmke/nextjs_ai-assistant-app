import React from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

function Heder() {
  return (
    <div className="p-4 shadow-md flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <Image src={'/logo.svg'} alt="log" width={40} height={40} />
        <p className="font-bold text-lg">AI Companion</p>
      </div>
      <Link href={'/assistants'}>
        <Button>Get Started</Button>
      </Link>
    </div>
  );
}

export default Heder;
