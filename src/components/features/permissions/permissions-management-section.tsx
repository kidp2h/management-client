'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getPermissions } from '@/db/queries/permissions';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { PermissionsTable } from './permissions-table';

export interface PermissionsManagementSectionProps {
  permissions: ReturnType<typeof getPermissions>;
}
export default function PermissionsManagementSection({
  permissions,
}: PermissionsManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Quyền' },
  ];
  return (
    <ContentLayout title="Quyền">
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
            <PermissionsTable permissions={permissions} />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
