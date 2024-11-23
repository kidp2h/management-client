'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getDuties } from '@/db/queries/duties';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { DutiesTable } from './duties-table';

export interface DutiesManagementSectionProps {
  duties: ReturnType<typeof getDuties>;
}
export default function DutiesManagementSection({
  duties,
}: DutiesManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Chức vụ' },
  ];
  return (
    <ContentLayout title="Chức vụ">
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
            <DutiesTable duties={duties} />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
