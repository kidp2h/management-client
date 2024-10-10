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
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import type { getRecords } from '@/db/queries/records';
import type { Ranks, Religions } from '@/db/schema';
import { ContentLayout } from '@/layouts';
import { useGlobalStore } from '@/providers/global-store-provider';
import { TableProvider } from '@/providers/table-provider';

import DepartmentsTreePanel from './departments-tree-panel';
import { RecordsTable } from './records-table';

type RecordsManagementSectionProps = {
  records: ReturnType<typeof getRecords>;
  religions: Religions[];
  ranks: Ranks[];
};
export const RecordsManagementSection = ({
  records,
  religions,
  ranks,
}: RecordsManagementSectionProps) => {
  const { setReligions, setRanks } = useGlobalStore(state => state);
  useEffect(() => {
    setReligions(religions);
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
          <ResizablePanelGroup direction="horizontal" className="w-full">
            <DepartmentsTreePanel />

            <ResizableHandle withHandle />
            <ResizablePanel className="w-[70%] p-2" defaultSize={70}>
              <div className="w-full">
                <Menubar className="h-[4.5%] bg-card">
                  <MenubarMenu>
                    <MenubarTrigger className="cursor-pointer font-bold">
                      Nghiệp vụ
                    </MenubarTrigger>
                    <MenubarContent className="bg-card">
                      <MenubarItem>
                        Xuất file <MenubarShortcut>⌘T</MenubarShortcut>
                      </MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem>In</MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                  <MenubarMenu>
                    <MenubarTrigger className="cursor-pointer font-bold">
                      Dữ liệu
                    </MenubarTrigger>
                    <MenubarContent className="bg-card">
                      <MenubarItem>
                        Xuất file <MenubarShortcut>⌘T</MenubarShortcut>
                      </MenubarItem>
                      <MenubarSeparator />
                      <MenubarItem>In</MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              </div>
              <div className="mt-1">
                <TableProvider isHidden>
                  <RecordsTable
                    records={records}
                    religions={religions}
                    ranks={ranks}
                  />
                </TableProvider>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </MainContent>
    </ContentLayout>
  );
};
