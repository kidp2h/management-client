'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getFamilyBackgrounds } from '@/db/queries/family-backgrounds';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { FamilyBackgroundsTable } from './family-backgrounds-table';

export interface FamilyBackgroundsManagementSectionProps {
  familyBackgrounds: ReturnType<typeof getFamilyBackgrounds>;
}
export default function FamilyBackgroundsManagementSection({
  familyBackgrounds,
}: FamilyBackgroundsManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Gia đình xuất thân' },
  ];
  return (
    <ContentLayout title="Gia đình xuất thân">
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
            <FamilyBackgroundsTable familyBackgrounds={familyBackgrounds} />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
