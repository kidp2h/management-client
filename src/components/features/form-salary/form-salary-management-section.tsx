'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getFormSalary } from '@/db/queries/form-salary';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { FormSalaryTable } from './form-salary-table';

export interface FormSalaryManagementSectionProps {
  formSalary: ReturnType<typeof getFormSalary>;
}
export default function FormSalaryManagementSection({
  formSalary,
}: FormSalaryManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Hình thức hưởng lương' },
  ];
  return (
    <ContentLayout title="Hình thức hưởng lương">
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
            <FormSalaryTable formSalary={formSalary} />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
