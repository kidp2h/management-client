import React from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { ContentLayout } from '@/layouts';

import { BarGraph, type BarGraphData } from './bar-graph';
import OverviewSection, { type OverviewData } from './overview-section';
import RecentRecordsSection from './recent-records-section';

export interface DashboardSectionProps {
  data: {
    overview: OverviewData;
    recent3Months: BarGraphData;
    recent7Days: any[];
  };
}

export default function DashboardSection({ data }: DashboardSectionProps) {
  const items = [{ name: 'Bảng điều khiển' }];
  return (
    <ContentLayout title="Bảng điều khiển">
      <AutoBreadcrumb items={items} />
      <MainContent>
        <div className="mb-5 text-2xl font-extrabold uppercase">Tổng quan</div>
        <OverviewSection data={data.overview} />
        <div className="mb-5 grid grid-cols-1 gap-4 lg:grid-cols-1 xl:grid-cols-7">
          <BarGraph data={data.recent3Months} />
          <RecentRecordsSection recordsRecent7Days={data.recent7Days} />
          {/* <AreaGraph data={{}} /> */}
        </div>
      </MainContent>
    </ContentLayout>
  );
}
