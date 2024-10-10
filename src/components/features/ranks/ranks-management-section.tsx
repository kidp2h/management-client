'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getRanks } from '@/db/queries/ranks';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { RanksTable } from './ranks-table';

export interface RanksManagementSectionProps {
  ranks: ReturnType<typeof getRanks>;
}
export default function RanksManagementSection({
  ranks,
}: RanksManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Cấp bậc' },
  ];
  return (
    <ContentLayout title="Cấp bậc">
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
            <RanksTable ranks={ranks} />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
