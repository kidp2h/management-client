'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getFormRetires } from '@/db/queries/form-retires';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { FormRetiresTable } from './form-retires-table';

export interface FormRetiresManagementSectionProps {
  formRetires: ReturnType<typeof getFormRetires>;
}
export default function FormRetiresManagementSection({
  formRetires,
}: FormRetiresManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Hình thức nghỉ hưu' },
  ];
  return (
    <ContentLayout title="Hình thức nghỉ hưu">
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
            <FormRetiresTable formRetires={formRetires} />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
