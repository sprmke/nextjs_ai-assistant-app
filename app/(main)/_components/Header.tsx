'use client';

import React, { useContext, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { AuthContext } from '@/context/AuthContext';
import UserProfile from '../workspace/_components/UserProfile';
import { LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserCircle2 } from 'lucide-react';

function Header() {
  const { user } = useContext(AuthContext);

  const [openUserProfile, setOpenUserProfile] = useState(false);

  return (
    <div className="top-0 bg-white p-3 shadow-sm w-full flex justify-between items-center px-5 fixed z-10">
      <Link href="/">
        <Image src={'/logo.svg'} alt="App Logo" width={40} height={40} />
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-x-3 cursor-pointer">
            <p className="hidden md:flex">{user?.name}</p>
            {user?.picture && (
              <Image
                src={user?.picture}
                alt="App Logo"
                width={40}
                height={40}
                className="rounded-full"
                onClick={() => setOpenUserProfile(true)}
              />
            )}
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[200px]" align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpenUserProfile(true)}>
            <UserCircle2 />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogOut />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UserProfile
        openUserProfile={openUserProfile}
        setOpenUserProfile={setOpenUserProfile}
      />
    </div>
  );
}

export default Header;
