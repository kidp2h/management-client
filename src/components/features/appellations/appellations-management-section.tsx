'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getAppellations } from '@/db/queries/appellations';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { AppellationsTable } from './appellations-table';

export interface AppellationsManagementSectionProps {
  appellations: ReturnType<typeof getAppellations>;
}
export default function AppellationsManagementSection({
  appellations,
}: AppellationsManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Danh hiệu' },
  ];
  return (
    <ContentLayout title="Danh hiệu">
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
            <AppellationsTable appellations={appellations} />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
