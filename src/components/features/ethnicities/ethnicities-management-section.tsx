'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getEthnicities } from '@/db/queries/ethnicities';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { EthnicitiesTable } from './ethnicities-table';

export interface EthnicitiesManagementSectionProps {
  ethnicities: ReturnType<typeof getEthnicities>;
}
export default function EthnicitiesManagementSection({
  ethnicities,
}: EthnicitiesManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Dân tộc' },
  ];
  return (
    <ContentLayout title="Dân tộc">
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
            <EthnicitiesTable ethnicities={ethnicities} />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
