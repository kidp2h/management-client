'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getQualifications } from '@/db/queries/qualifications';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { QualificationsTable } from './qualifications-table';

export interface QualificationsManagementSectionProps {
  qualifications: ReturnType<typeof getQualifications>;
}
export default function QualificationsManagementSection({
  qualifications,
}: QualificationsManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Trình độ chuyên môn' },
  ];
  return (
    <ContentLayout title="Trình độ chuyên môn">
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
            <QualificationsTable qualifications={qualifications} />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
