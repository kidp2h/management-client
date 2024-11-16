'use client';
import { MenuIcon, PanelsTopLeft } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Menu } from '@/components/common/sidebar/menu';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { getMenuList } from '@/config/sidebar';

type SheetMenuProps = {};
export function SheetMenu({}: SheetMenuProps) {
  const pathName = usePathname();
  const menuList = getMenuList(pathName);
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden" asChild>
        <Button className="h-8" variant="outline" size="icon">
          <MenuIcon size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full flex-col px-3 sm:w-72" side="left">
        <SheetHeader>
          <Button
            className="flex items-center justify-center pb-2 pt-1"
            variant="link"
            asChild
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <PanelsTopLeft className="mr-1 size-6" />
              <SheetTitle className="text-lg font-bold">Management</SheetTitle>
            </Link>
          </Button>
        </SheetHeader>
        <Menu isOpen menuList={menuList} />
      </SheetContent>
    </Sheet>
  );
}
