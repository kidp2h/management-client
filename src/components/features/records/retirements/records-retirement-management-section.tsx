'use client';
import React from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { _getRecords } from '@/db/queries/records';
import { ContentLayout } from '@/layouts';

import RecordsNearRetirementTable from './records-near-retirement-table';
import RecordsRetiredTable from './records-retired-table';

type RecordsRetirementManagementSectionProps = {
  records: ReturnType<typeof _getRecords>;
};
export const RecordsRetireManagementSection =
  ({}: RecordsRetirementManagementSectionProps) => {
    const items = [
      { name: 'Trang chủ', href: '/' },
      { isSeparator: true },
      { name: 'Nghỉ hưu' },
    ];
    return (
      <ContentLayout title="Nghỉ hưu">
        <AutoBreadcrumb items={items} />
        <MainContent>
          <Tabs defaultValue="listNearRetirementDate" className="w-full">
            <TabsList>
              <TabsTrigger value="listNearRetirementDate">
                Danh sách sắp đến hạn nghỉ hưu
              </TabsTrigger>
              <TabsTrigger value="listRetired">
                Danh sách đã nghỉ hưu
              </TabsTrigger>
            </TabsList>
            <TabsContent value="listNearRetirementDate">
              <RecordsNearRetirementTable />
            </TabsContent>
            <TabsContent value="listRetired">
              <RecordsRetiredTable />
            </TabsContent>
          </Tabs>
        </MainContent>
      </ContentLayout>
    );
  };
