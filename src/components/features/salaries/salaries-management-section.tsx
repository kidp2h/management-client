'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getSalaries } from '@/db/queries/salaries';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { SalariesTable } from './salaries-table';
import { getAllSalaryGrades } from '@/db/queries/salary-grades';

export interface SalariesManagementSectionProps {
  salaries: ReturnType<typeof getSalaries>;
  grades: ReturnType<typeof getAllSalaryGrades>;
}
export default function SalariesManagementSection({
  salaries,
  grades,
}: SalariesManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Lương' },
  ];
  return (
    <ContentLayout title="Lương">
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
            <SalariesTable salaries={salaries} grades={grades} />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
