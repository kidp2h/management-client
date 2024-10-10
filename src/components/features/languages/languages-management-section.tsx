'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getLanguages } from '@/db/queries/languages';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { LanguagesTable } from './languages-table';

export interface LanguagesManagementSectionProps {
  languages: ReturnType<typeof getLanguages>;
}
export default function LanguagesManagementSection({
  languages,
}: LanguagesManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Ngôn ngữ' },
  ];
  return (
    <ContentLayout title="Ngôn ngữ">
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
            <LanguagesTable languages={languages} />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
