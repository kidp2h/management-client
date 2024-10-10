'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import { Footer } from '@/components/common/footer';
import { Sidebar } from '@/components/common/sidebar/';
import { getMenuList } from '@/config/sidebar';
import { cn } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global-store-provider';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { isOpen } = useGlobalStore(state => state);
  const pathname = usePathname();
  const menuList = getMenuList(pathname);

  return (
    <>
      <Sidebar menuList={menuList} />
      <main
        className={cn(
          'min-h-[calc(100vh_-_56px)] bg-zinc-50 dark:bg-zinc-900 transition-[margin-left]',
          isOpen === false ? 'lg:ml-[90px]' : 'lg:ml-72',
        )}
      >
        {children}
      </main>
      <footer
        className={cn(
          'transition-[margin-left] ease-in-out duration-300',
          isOpen === false ? 'lg:ml-[90px]' : 'lg:ml-72',
        )}
      >
        <Footer />
      </footer>
    </>
  );
}
