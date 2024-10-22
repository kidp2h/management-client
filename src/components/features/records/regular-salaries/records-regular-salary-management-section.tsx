'use client';
import React from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import type { getRecords } from '@/db/queries/records';
import { ContentLayout } from '@/layouts';

type RecordsRegularSalaryManagementSectionProps = {
  records: ReturnType<typeof getRecords>;
};
export const RecordsRegularSalaryManagementSection =
  ({}: RecordsRegularSalaryManagementSectionProps) => {
    const items = [
      { name: 'Trang chủ', href: '/' },
      { isSeparator: true },
      { name: 'Nâng lương thường xuyên' },
    ];
    return (
      <ContentLayout title="Nâng lương thường xuyên">
        <AutoBreadcrumb items={items} />
        <MainContent>x</MainContent>
      </ContentLayout>
    );
  };
