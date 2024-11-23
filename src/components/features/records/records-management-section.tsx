'use client';
import React from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';

import type { getRecords } from '@/db/queries/records';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { RecordsTable } from './records-table';
import { getAllReligions } from '@/db/queries/religions';

type RecordsManagementSectionProps = {
  records: ReturnType<typeof getRecords>;
  religions: ReturnType<typeof getAllReligions>;
};
export const RecordsManagementSection = ({
  records,
  religions,
}: RecordsManagementSectionProps) => {
  // const isDesktop = useMediaQuery('(min-width: 1024px)');

  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý hồ sơ' },
  ];
  return (
    <ContentLayout title="Quản lý hồ sơ">
      <AutoBreadcrumb items={items} />
      <MainContent>
        <div className="mt-1">
          <TableProvider isHidden>
            <RecordsTable records={records} religions={religions} />
          </TableProvider>
        </div>
        {/* </ResizablePanel>
          </ResizablePanelGroup> */}
        {/* </div> */}
      </MainContent>
    </ContentLayout>
  );
};
