'use client';
import React from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type {
  getRecordsRetired,
  getRecordsRetirement,
} from '@/db/queries/records';

import RecordsNearRetirementTable from './records-near-retirement-table';
import RecordsRetiredTable from './records-retired-table';

type RecordsRetirementManagementSectionProps = {
  recordsRetirement: ReturnType<typeof getRecordsRetirement>;
  recordsRetired: ReturnType<typeof getRecordsRetired>;
  cDepartment: any;
};
export const RecordsRetireManagementSection = ({
  recordsRetirement,
  recordsRetired,
  cDepartment,
}: RecordsRetirementManagementSectionProps) => {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Nghỉ hưu' },
  ];
  return (
    // <ContentLayout title="Nghỉ hưu">
    //   <AutoBreadcrumb items={items} />
    //   <MainContent>

    //   </MainContent>
    // </ContentLayout>
    <Tabs defaultValue="listNearRetirementDate" className="w-full">
      <TabsList>
        <TabsTrigger value="listNearRetirementDate">
          Danh sách sắp đến hạn nghỉ hưu
        </TabsTrigger>
        <TabsTrigger value="listRetired">Danh sách đã nghỉ hưu</TabsTrigger>
      </TabsList>
      <TabsContent value="listNearRetirementDate">
        <RecordsNearRetirementTable
          records={recordsRetirement}
          cDepartment={cDepartment}
        />
      </TabsContent>
      <TabsContent value="listRetired">
        <RecordsRetiredTable
          recordsRetired={recordsRetired}
          cDepartment={cDepartment}
        />
      </TabsContent>
    </Tabs>
  );
};
