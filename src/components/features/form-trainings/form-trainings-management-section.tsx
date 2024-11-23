'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getFormTrainings } from '@/db/queries/form-trainings';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { FormTrainingsTable } from './form-trainings-table';

export interface FormTrainingsManagementSectionProps {
  formTrainings: ReturnType<typeof getFormTrainings>;
}
export default function FormTrainingsManagementSection({
  formTrainings,
}: FormTrainingsManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Hình thức đào tạo' },
  ];
  return (
    <ContentLayout title="Hình thức đào tạo">
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
            <FormTrainingsTable formTrainings={formTrainings} />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
