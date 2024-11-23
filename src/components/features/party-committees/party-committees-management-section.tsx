'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type { getPartyCommittees } from '@/db/queries/party-committees';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { PartyCommitteesTable } from './party-committees-table';

export interface PartyCommitteesManagementSectionProps {
  partyCommittees: ReturnType<typeof getPartyCommittees>;
}
export default function PartyCommitteesManagementSection({
  partyCommittees,
}: PartyCommitteesManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Quân hàm' },
  ];
  return (
    <ContentLayout title="Quân hàm">
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
            <PartyCommitteesTable partyCommittees={partyCommittees} />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
