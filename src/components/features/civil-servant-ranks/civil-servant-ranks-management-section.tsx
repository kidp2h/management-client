'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getCivilServantRanks } from '@/db/queries/civil-servant-ranks';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { CivilServantRanksTable } from './civil-servant-ranks-table';

export interface CivilServantRanksManagementSectionProps {
  civilServantRanks: ReturnType<typeof getCivilServantRanks>;
}
export default function CivilServantRanksManagementSection({
  civilServantRanks,
}: CivilServantRanksManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Ngạch công chức' },
  ];
  return (
    <ContentLayout title="Ngạch công chức">
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
            <CivilServantRanksTable civilServantRanks={civilServantRanks} />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
