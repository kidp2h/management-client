'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getLanguageCertifications } from '@/db/queries/language-certifications';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { LanguageCertificationsTable } from './language-certifications-table';

export interface LanguageCertificationsManagementSectionProps {
  languageCertifications: ReturnType<typeof getLanguageCertifications>;
}
export default function LanguageCertificationsManagementSection({
  languageCertifications,
}: LanguageCertificationsManagementSectionProps) {
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
            <LanguageCertificationsTable
              languageCertifications={languageCertifications}
            />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
