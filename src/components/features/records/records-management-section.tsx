'use client';
import React from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';

import type { getRecords } from '@/db/queries/records';
import type { Ranks } from '@/db/schema';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { RecordsTable } from './records-table';

type RecordsManagementSectionProps = {
  records: ReturnType<typeof getRecords>;
  ranks: Ranks[];
};
export const RecordsManagementSection = ({
  records,
  ranks,
}: RecordsManagementSectionProps) => {
  // const { setRanks } = useGlobalStore(state => state);
  // // const isDesktop = useMediaQuery('(min-width: 1024px)');
  // useEffect(() => {
  //   setRanks(ranks);
  // }, []);
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
            <RecordsTable records={records} ranks={ranks} />
          </TableProvider>
        </div>
        {/* </ResizablePanel>
          </ResizablePanelGroup> */}
        {/* </div> */}
      </MainContent>
    </ContentLayout>
  );
};
