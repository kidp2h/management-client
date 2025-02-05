'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getMilitaryRanks } from '@/db/queries/military-ranks';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { MilitaryRanksTable } from './military-ranks-table';

export interface MilitaryRanksManagementSectionProps {
  militaryRanks: ReturnType<typeof getMilitaryRanks>;
}
export default function MilitaryRanksManagementSection({
  militaryRanks,
}: MilitaryRanksManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Quân hàm' },
  ];
  return (
    <ContentLayout title="Quân hàm">
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
            <MilitaryRanksTable militaryRanks={militaryRanks} />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
