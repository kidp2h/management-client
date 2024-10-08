'use memo';
import React from 'react';

import { RecordsManagementSection } from '@/components/features/records';
import type { SearchParams } from '@/types';

type RecordsManagementPageProps = {
  searchParams: SearchParams;
};
export default async function RecordsManagementPage({
  searchParams,
}: RecordsManagementPageProps) {
  const records = [
    {
      id: '1',
      code: 'R0001',
    },
    {
      id: '2',
      code: 'R0002',
    },
    {
      id: '3',
      code: 'R0003',
    },
  ];
  const getRecords = (searchParams: any) => {
    return new Promise(resolve => {
      resolve({
        data: records.filter(record => {
          if (searchParams.code) {
            return record.code.includes(searchParams.code);
          }
          return true;
        }),
        pageCount: 1,
      });
    });
  };
  // const _ = getRecords(searchParams);
  return <RecordsManagementSection records={getRecords(searchParams)} />;
}
