'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getDepartments } from '@/db/queries/departments';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { DepartmentsTable } from './departments-table';

export interface DepartmentsManagementSectionProps {
  departments: ReturnType<typeof getDepartments>;
}
export default function DepartmentsManagementSection({
  departments,
}: DepartmentsManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Đơn vị' },
  ];
  return (
    <ContentLayout title="Đơn vị">
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
            <DepartmentsTable departments={departments} />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
