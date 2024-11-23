'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getFormRecruitments } from '@/db/queries/form-recruitments';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { FormRecruitmentsTable } from './form-recruitments-table';

export interface FormRecruitmentsManagementSectionProps {
  formRecruitments: ReturnType<typeof getFormRecruitments>;
}
export default function FormRecruitmentsManagementSection({
  formRecruitments,
}: FormRecruitmentsManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Hình thức tuyển dụng' },
  ];
  return (
    <ContentLayout title="Hình thức tuyển dụng">
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
            <FormRecruitmentsTable formRecruitments={formRecruitments} />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
