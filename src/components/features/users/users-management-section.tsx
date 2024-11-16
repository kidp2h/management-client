'use client';
import type { User } from '@clerk/nextjs/server';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { UsersTable } from './users-table';
import { Roles } from '@/db/schema';

export interface UsersManagementSectionProps {
  users: User[];
  pageCount: number;
  roles: Roles[];
}

export const UsersManagementSection = ({
  users,
  pageCount,
  roles,
}: UsersManagementSectionProps) => {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý tài khoản' },
  ];
  return (
    <ContentLayout title="Quản lý hồ sơ">
      <AutoBreadcrumb items={items} />
      <MainContent>
        <div className="mt-1">
          <TableProvider isHidden>
            <UsersTable users={users} pageCount={pageCount} roles={roles} />
          </TableProvider>
        </div>
      </MainContent>
    </ContentLayout>
  );
};
