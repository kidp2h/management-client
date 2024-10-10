'use client';
import { PanelsTopLeft } from 'lucide-react';
import Link from 'next/link';

import type { Group } from '@/components/common/sidebar/menu';
import { Menu } from '@/components/common/sidebar/menu';
import { SidebarToggle } from '@/components/common/sidebar/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global-store-provider';

export type SidebarProps = {
  menuList: Group[];
};
export function Sidebar({ menuList }: SidebarProps) {
  const { isOpen, toggle } = useGlobalStore(state => state);

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-20 h-screen -translate-x-full lg:translate-x-0 transition-[width] ease-in-out duration-300',
        isOpen === false ? 'w-[90px]' : 'w-72',
      )}
    >
      <SidebarToggle isOpen={isOpen} setToggle={() => toggle()} />
      <div
        className={cn(
          'relative flex flex-col px-3 py-4 overflow-y-auto shadow-md dark:shadow-zinc-800 h-full',
        )}
      >
        <Button
          className={cn(
            'transition-transform ease-in-out duration-300 mb-1',
            isOpen === false ? 'translate-x-1' : 'translate-x-0',
          )}
          variant="link"
          asChild
        >
          <Link href="/dashboard" className="flex items-center gap-2">
            <PanelsTopLeft className="mr-1 size-6" />
            <h1
              className={cn(
                'font-bold text-lg whitespace-nowrap transition-[transform,opacity,display] ease-in-out duration-300',
                isOpen === false
                  ? '-translate-x-96 opacity-0 hidden'
                  : 'translate-x-0 opacity-100',
              )}
            >
              Brand
            </h1>
          </Link>
        </Button>
        <Menu isOpen={isOpen} menuList={menuList} />
      </div>
    </aside>
  );
}
