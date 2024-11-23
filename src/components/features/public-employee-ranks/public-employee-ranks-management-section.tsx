'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getPublicEmployeeRanks } from '@/db/queries/public-employee-ranks';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { PublicEmployeeRanksTable } from './public-employee-ranks-table';

export interface PublicEmployeeRanksManagementSectionProps {
  publicEmployeeRanks: ReturnType<typeof getPublicEmployeeRanks>;
}
export default function PublicEmployeeRanksManagementSection({
  publicEmployeeRanks,
}: PublicEmployeeRanksManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Ngạch viên chức' },
  ];
  return (
    <ContentLayout title="Ngạch viên chức">
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
            <PublicEmployeeRanksTable
              publicEmployeeRanks={publicEmployeeRanks}
            />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
