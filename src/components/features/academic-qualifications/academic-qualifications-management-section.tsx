'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getAcademicQualifications } from '@/db/queries/academic-qualifications';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { AcademicQualificationsTable } from './academic-qualifications-table';

export interface AcademicQualificationsManagementSectionProps {
  academicQualifications: ReturnType<typeof getAcademicQualifications>;
}
export default function AcademicQualificationsManagementSection({
  academicQualifications,
}: AcademicQualificationsManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Học hàm' },
  ];
  return (
    <ContentLayout title="Học hàm">
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
            <AcademicQualificationsTable
              academicQualifications={academicQualifications}
            />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
