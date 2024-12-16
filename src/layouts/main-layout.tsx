'use client';

import { usePathname } from 'next/navigation';
import React, { use, useEffect } from 'react';

import { Footer } from '@/components/common/footer';
import { Sidebar } from '@/components/common/sidebar/';
import { getMenuList } from '@/config/sidebar';
import { cn } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global-store-provider';
import { useUser } from '@clerk/nextjs';
import { getConfigRole } from '@/db/queries/roles';

export function MainLayout({
  children,
  configRole,
}: {
  children: React.ReactNode;
  configRole: ReturnType<typeof getConfigRole>;
}) {
  const { isOpen } = useGlobalStore(state => state);
  const pathname = usePathname();
  const { user } = useUser();

  const { setRoleAdmin, roleAdmin, setRoleApprove, roleApprove } =
    useGlobalStore(state => state);
  const { data: dataConfigRole } = use(configRole);
  const menuList = getMenuList(
    pathname,
    dataConfigRole?.[0]?.roleId || [],
    dataConfigRole?.[0]?.rolesCanApprove || [],
    user,
  );
  useEffect(() => {
    if (dataConfigRole && dataConfigRole?.length > 0) {
      setRoleAdmin(dataConfigRole?.[0]?.roleId || []);
      setRoleApprove(dataConfigRole?.[0]?.rolesCanApprove || []);
    }
  }, []);

  return (
    <>
      {user && dataConfigRole && dataConfigRole.length > 0 && (
        <Sidebar menuList={menuList} />
      )}
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
