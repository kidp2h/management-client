'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getTypeContracts } from '@/db/queries/type-contracts';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { TypeContractsTable } from './type-contracts-table';

export interface TypeContractsManagementSectionProps {
  typeContracts: ReturnType<typeof getTypeContracts>;
}
export default function TypeContractsManagementSection({
  typeContracts,
}: TypeContractsManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Loại hợp đồng' },
  ];
  return (
    <ContentLayout title="Loại hợp đồng">
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
            <TypeContractsTable typeContracts={typeContracts} />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
