'use client';

import React, { useContext } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

import { AuthContext } from '@/context/AuthContext';
import { AuroraText } from '@/components/magicui/aurora-text';
import HeroVideoDialog from '@/components/magicui/hero-video-dialog';
import { AnimatedGridPattern } from '@/components/magicui/animated-grid-pattern';
import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text';
import { RainbowButton } from '@/components/magicui/rainbow-button';
import { Button } from '@/components/ui/button';

import Header from './Header';

function Hero() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <Header />
      <div className="relative top-[64px] flex scrollbar-hide w-full items-start justify-center bg-background pt-10 p-5 sm:p-20">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3}
          className="[mask-image:radial-gradient(500px_circle_at_center,white,transparent)] inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
        />

        <div className="flex flex-col items-center justify-center text-center gap-5 relative z-10">
          <div className="group relative mx-auto flex items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
            <span
              className="absolute inset-0 block h-full w-full animate-gradient rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
              style={{
                WebkitMask:
                  'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'destination-out',
                mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                maskComposite: 'subtract',
                WebkitClipPath: 'padding-box',
              }}
            />
            <AnimatedGradientText className="text-sm font-medium">
              Personal + Customizable AI Companions
            </AnimatedGradientText>
          </div>

          <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-7xl max-w-4xl">
            Your Personal <AuroraText>AI Companions</AuroraText> for Every
            Journey
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl">
            Experience the future of personal assistance with our customizable
            AI companions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-5">
            {user ? (
              <Link href="/workspace">
                <RainbowButton>Continue to Workspace</RainbowButton>
              </Link>
            ) : (
              <Link href="/sign-in">
                <RainbowButton>Get Started</RainbowButton>
              </Link>
            )}
            <Link href="/assistants">
              <Button variant="outline" className="font-medium p-5 text-md">
                Meet your AI Companions
              </Button>
            </Link>
          </div>

          <div className="max-w-2xl mt-8">
            <HeroVideoDialog
              className="block dark:hidden"
              animationStyle="from-center"
              videoSrc="https://www.youtube.com/embed/yPYZpwSpKmA?si=eleRgiXz83cbgYRe"
              thumbnailSrc="/hero-thumbnail.png"
              thumbnailAlt="Hero Video"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
