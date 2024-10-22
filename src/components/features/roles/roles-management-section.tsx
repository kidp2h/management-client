'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getRoles } from '@/db/queries/roles';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { RolesTable } from './roles-table';

export interface RolesManagementSectionProps {
  roles: ReturnType<typeof getRoles>;
}
export default function RolesManagementSection({
  roles,
}: RolesManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Vai trò' },
  ];
  return (
    <ContentLayout title="Vai trò">
      <AutoBreadcrumb items={items} />
      <MainContent hasCard={false}>
        <TableProvider isHidden>
          <Suspense
            fallback={
              <DataTableSkeleton
                columnCount={3}
                searchableColumnCount={2}
                filterableColumnCount={2}
                cellWidths={['10rem']}
                shrinkZero
              />
            }
          >
            <RolesTable roles={roles} />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
