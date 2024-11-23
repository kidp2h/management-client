'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getFormDisciplines } from '@/db/queries/form-disciplines';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { FormDisciplinesTable } from './form-disciplines-table';

export interface FormDisciplinesManagementSectionProps {
  formDisciplines: ReturnType<typeof getFormDisciplines>;
}
export default function FormDisciplinesManagementSection({
  formDisciplines,
}: FormDisciplinesManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Hình thức kỷ luật' },
  ];
  return (
    <ContentLayout title="Hình thức kỷ luật">
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
            <FormDisciplinesTable formDisciplines={formDisciplines} />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
