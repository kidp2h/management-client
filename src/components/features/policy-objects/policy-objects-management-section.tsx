'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getPolicyObjects } from '@/db/queries/policy-objects';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { PolicyObjectsTable } from './policy-objects-table';

export interface PolicyObjectsManagementSectionProps {
  policyObjects: ReturnType<typeof getPolicyObjects>;
}
export default function PolicyObjectsManagementSection({
  policyObjects,
}: PolicyObjectsManagementSectionProps) {
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
            <PolicyObjectsTable policyObjects={policyObjects} />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
