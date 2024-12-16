'use client';
import { ModeToggle } from '@/components/common/mode-toggle';
import { SheetMenu } from '@/components/common/sheet-menu';
import { UserNav } from '@/components/common/user-nav';
import type { getConfigRole } from '@/db/queries/roles';

type NavbarProps = {
  title: string;
  isAuth: boolean;
  configRole?: ReturnType<typeof getConfigRole>;
};

export function Navbar({ title, isAuth, configRole }: NavbarProps) {
  // const configRole = getConfigRole();
  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 flex h-14 items-center sm:mx-8">
        <div className="flex items-center space-x-4 lg:space-x-0">
          {isAuth && <SheetMenu configRole={configRole} />}
          <h1 className="font-bold">{title}</h1>
        </div>
        <div className="flex flex-1 items-center justify-end">
          <ModeToggle />
          {isAuth && <UserNav />}
        </div>
      </div>
    </header>
  );
}
