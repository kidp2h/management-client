'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getTechnologyCertifications } from '@/db/queries/technology-certifications';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { TechnologyCertificationsTable } from './technology-certifications-table';

export interface TechnologyCertificationsManagementSectionProps {
  technologyCertifications: ReturnType<typeof getTechnologyCertifications>;
}
export default function TechnologyCertificationsManagementSection({
  technologyCertifications,
}: TechnologyCertificationsManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Chứng chỉ' },
  ];
  return (
    <ContentLayout title="Chứng chỉ">
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
            <TechnologyCertificationsTable
              technologyCertifications={technologyCertifications}
            />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
