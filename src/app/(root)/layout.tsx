import '@/app/globals.css';

import type { Metadata } from 'next';

import { MainLayout } from '@/layouts';
import { getConfigRole } from '@/db/queries/roles';

export const metadata: Metadata = {
  title: 'Quản lý hồ sơ',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const configRole = getConfigRole();
  return <MainLayout configRole={configRole}>{children}</MainLayout>;
}
