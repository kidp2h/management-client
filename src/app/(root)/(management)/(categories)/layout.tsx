import '@/app/globals.css';
import { getConfigRole } from '@/db/queries/roles';
import { currentUser } from '@clerk/nextjs/server';

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Quản lý hồ sơ',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [configRole, user] = await Promise.all([
    getConfigRole(),
    currentUser(),
  ]);
  const userRoles = (user?.publicMetadata.role as any[]) || [];
  // console.log(user?.publicMetadata, 'roleAdmin ne', roleAdminId);
  // user?.publicMetadata.role is array role, check that array role is in roleAdminId
  const roleAdminId = configRole.data?.[0]?.roleId || [];
  const isAdmin = userRoles.some(role => roleAdminId?.includes(role.id));

  if (!user) {
    redirect('/auth');
  }
  if (!isAdmin) {
    redirect('/');
  }

  return <>{children}</>;
}
