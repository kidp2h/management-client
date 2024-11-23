'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getFormCommendations } from '@/db/queries/form-commendations';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { FormCommendationsTable } from './form-commendations-table';

export interface FormCommendationsManagementSectionProps {
  formCommendations: ReturnType<typeof getFormCommendations>;
}
export default function FormCommendationsManagementSection({
  formCommendations,
}: FormCommendationsManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Hình thức khen thưởng' },
  ];
  return (
    <ContentLayout title="Hình thức khen thưởng">
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
            <FormCommendationsTable formCommendations={formCommendations} />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
