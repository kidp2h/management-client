'use client';
import React from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { TreeView } from '@/components/extends/tree-view';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { RecordsTable } from './records-table';

type RecordsManagementSectionProps = {
  records: any;
};
export const RecordsManagementSection = ({
  records,
}: RecordsManagementSectionProps) => {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý hồ sơ' },
  ];
  const elements = [
    {
      id: '1',
      name: 'UBND HCM',
      children: [
        {
          id: '2',
          name: 'Van phong UBND',
        },
        {
          id: '3',
          name: 'Van phong doan dbqh va hdnd',
        },
        {
          id: '4',
          name: 'So Noi Vu',
          children: [
            {
              id: '5',
              name: 'So noi vu 1',
            },
          ],
        },
      ],
    },
  ];
  return (
    <ContentLayout title="Quản lý hồ sơ">
      <AutoBreadcrumb items={items} />
      <MainContent>
        <div className="flex size-full flex-row">
          <ResizablePanelGroup direction="horizontal" className="w-full">
            <ResizablePanel
              className="w-[30%]"
              defaultSize={30}
              minSize={19}
              maxSize={50}
            >
              <div className="size-full rounded-l-lg bg-primary-foreground  p-2 shadow-lg">
                <Tabs defaultValue="tree" className="h-full p-0">
                  <TabsList className="grid h-[4.5%] grid-cols-2 gap-2">
                    <TabsTrigger value="tree">So do cay don vi</TabsTrigger>
                    <TabsTrigger value="tree-1">So do cay don vi1</TabsTrigger>
                  </TabsList>
                  <TabsContent value="tree" className="h-full">
                    <TreeView
                      className="h-[94.5%] overflow-hidden rounded-md bg-secondary p-2"
                      elements={elements}
                      expandAll
                    />
                  </TabsContent>
                  <TabsContent value="tree-1"></TabsContent>
                </Tabs>
              </div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel className="w-[70%] p-2" defaultSize={70}>
              <div className="w-full">
                <Menubar className="h-[4.5%] bg-card">
                  <MenubarMenu>
                    <MenubarTrigger className="cursor-pointer font-bold">
                      Tệp
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
                      Tìm kiếm
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
                <TableProvider isHidden={false}>
                  <RecordsTable records={records} />
                </TableProvider>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </MainContent>
    </ContentLayout>
  );
};
