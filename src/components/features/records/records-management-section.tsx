'use client';
import React, { useEffect } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import type { getRecords } from '@/db/queries/records';
import type { Ranks } from '@/db/schema';
import { useMediaQuery } from '@/hooks/use-media-query';
import { ContentLayout } from '@/layouts';
import { cn } from '@/lib/utils';
import { useGlobalStore } from '@/providers/global-store-provider';
import { TableProvider } from '@/providers/table-provider';

import DepartmentsTreePanel from './departments-tree-panel';
import { RecordsTable } from './records-table';

type RecordsManagementSectionProps = {
  records: ReturnType<typeof getRecords>;
  ranks: Ranks[];
};
export const RecordsManagementSection = ({
  records,
  ranks,
}: RecordsManagementSectionProps) => {
  const { setRanks } = useGlobalStore(state => state);
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  useEffect(() => {
    setRanks(ranks);
  }, []);
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý hồ sơ' },
  ];
  return (
    <ContentLayout title="Quản lý hồ sơ">
      <AutoBreadcrumb items={items} />
      <MainContent>
        <div className="flex size-full h-screen rounded-lg border">
          <ResizablePanelGroup
            direction={isDesktop ? 'horizontal' : 'vertical'}
            className="w-full"
          >
            <DepartmentsTreePanel />

            <ResizableHandle withHandle />
            <ResizablePanel
              className={cn('w-[70%] p-2', !isDesktop ? 'w-full' : '')}
              defaultSize={70}
            >
              <div className="w-full">
                <Menubar className="h-[4.5%] bg-card">
                  <MenubarMenu>
                    <MenubarTrigger className="cursor-pointer font-bold">
                      Nghiệp vụ
                    </MenubarTrigger>
                    <MenubarContent className="bg-card">
                      <MenubarItem>Điều động</MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem>Thôi việc</MenubarItem>
                      <MenubarItem>Đã mất</MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              </div>
              <div className="mt-1">
                <TableProvider isHidden>
                  <RecordsTable records={records} ranks={ranks} />
                </TableProvider>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </MainContent>
    </ContentLayout>
  );
};
