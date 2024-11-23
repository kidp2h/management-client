'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getPositions } from '@/db/queries/positions';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { PositionsTable } from './positions-table';

export interface PositionsManagementSectionProps {
  positions: ReturnType<typeof getPositions>;
}
export default function PositionsManagementSection({
  positions,
}: PositionsManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Vị trí việc làm' },
  ];
  return (
    <ContentLayout title="Vị trí việc làm">
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
            <PositionsTable positions={positions} />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
