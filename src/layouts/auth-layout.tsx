'use client';

import { Footer, Navbar } from '@/components/common';
import { cn } from '@/lib/utils';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-dot-black/[0.15] dark:bg-dot-white/[0.05]">
      {/* <WavyBackground className=" mx-auto pb-40 w-full"> */}
      {/* <AuroraBackground> */}
      {/* <Spotlight
        className="-top-40 right-0 md:left-[25rem] md:-top-20 "
        fill={theme === 'dark' ? 'white' : 'black'}
      /> */}
      <Navbar title="Management" isAuth={false} />
      <div className="size-full">{children}</div>

      <footer
        className={cn(
          'transition-[margin-left] ease-in-out duration-300 absolute bottom-0 ',
          'w-full',
        )}
      >
        <Footer />
      </footer>
      {/* </AuroraBackground> */}
      {/* <BeamsBackground className="z-[-1]" /> */}
      {/* </WavyBackground> */}
      {/* <Spotlight /> */}
    </div>
  );
}
