'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getFormRemarks } from '@/db/queries/form-remarks';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { FormRemarksTable } from './form-remarks-table';

export interface FormRemarksManagementSectionProps {
  formRemarks: ReturnType<typeof getFormRemarks>;
}
export default function FormRemarksManagementSection({
  formRemarks,
}: FormRemarksManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Hình thức đánh giá' },
  ];
  return (
    <ContentLayout title="Hình thức đánh giá">
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
            <FormRemarksTable formRemarks={formRemarks} />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
