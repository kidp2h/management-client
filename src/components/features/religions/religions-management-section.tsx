'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getReligions } from '@/db/queries/religions';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { ReligionsTable } from './religions-table';

export interface ReligionsManagementSectionProps {
  religions: ReturnType<typeof getReligions>;
}
export default function ReligionsManagementSection({
  religions,
}: ReligionsManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Tôn giáo' },
  ];
  return (
    <ContentLayout title="Tôn giáo">
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
            <ReligionsTable religions={religions} />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
