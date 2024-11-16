'use client';
import React from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type {
  getRecordsRetired,
  getRecordsRetirement,
} from '@/db/queries/records';
import { ContentLayout } from '@/layouts';

import RecordsNearRetirementTable from './records-near-retirement-table';
import RecordsRetiredTable from './records-retired-table';

type RecordsRetirementManagementSectionProps = {
  records: ReturnType<typeof getRecordsRetirement>;
  recordsRetired: ReturnType<typeof getRecordsRetired>;
};
export const RecordsRetireManagementSection = ({
  records,
  recordsRetired,
}: RecordsRetirementManagementSectionProps) => {
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
            <TabsTrigger value="listRetired">Danh sách đã nghỉ hưu</TabsTrigger>
          </TabsList>
          <TabsContent value="listNearRetirementDate">
            <RecordsNearRetirementTable records={records} />
          </TabsContent>
          <TabsContent value="listRetired">
            <RecordsRetiredTable recordsRetired={recordsRetired} />
          </TabsContent>
        </Tabs>
      </MainContent>
    </ContentLayout>
  );
};
