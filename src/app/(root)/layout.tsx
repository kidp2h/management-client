import '@/app/globals.css';

import type { Metadata } from 'next';

import { MainLayout } from '@/layouts';

export const metadata: Metadata = {
  title: 'Quản lý hồ sơ',
};

export default function __MainLayout__({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MainLayout>{children}</MainLayout>;
}
