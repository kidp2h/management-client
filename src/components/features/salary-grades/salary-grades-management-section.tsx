'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getSalaryGrades } from '@/db/queries/salary-grades';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { SalaryGradesTable } from './salary-grades-table';

export interface SalaryGradesManagementSectionProps {
  salaryGrades: ReturnType<typeof getSalaryGrades>;
}
export default function SalaryGradesManagementSection({
  salaryGrades,
}: SalaryGradesManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Bậc lương' },
  ];
  return (
    <ContentLayout title="Bậc lương">
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
            <SalaryGradesTable salaryGrades={salaryGrades} />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
