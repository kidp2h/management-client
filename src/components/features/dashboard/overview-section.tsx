import { BookCheck, TentTree, UserX } from 'lucide-react';
import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CountAnimation from '@/components/ui/count-animation';

export interface OverviewData {
  totalRecords: number;
  totalRecordsDisciplined: number;
  totalRecordsRetired: number;
}
export interface OverviewSectionProps {
  data: OverviewData;
}

export default function OverviewSection({ data }: OverviewSectionProps) {
  return (
    <div className="mb-10 grid gap-4 md:grid-cols-1 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Số lượng hồ sơ CBCCVC
          </CardTitle>
          <BookCheck className="text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="inline-flex font-bold">
            <CountAnimation
              number={data.totalRecords || 0}
              className="text-2xl"
            />
          </div>
          <p className="text-xs text-muted-foreground">Tổng số lượng hồ sơ</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Số lượng CBCCVC bị kỷ luật
          </CardTitle>
          <UserX className="text-cyan-500" />
        </CardHeader>
        <CardContent>
          <div className="inline-flex font-bold">
            <CountAnimation
              number={data.totalRecordsDisciplined || 0}
              className="text-2xl"
            />
          </div>
          <p className="text-xs text-muted-foreground">CBCCVC bị kỷ luật</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Số lượng CBCCVC nghỉ hưu
          </CardTitle>
          <TentTree className="text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="inline-flex font-bold">
            <CountAnimation
              number={data.totalRecordsDisciplined || 0}
              className="text-2xl"
            />
          </div>
          <p className="text-xs text-muted-foreground">CBCCVC đã nghỉ hưu</p>
        </CardContent>
      </Card>
      {/* <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Số đơn đã hoàn thành
          </CardTitle>
          <BadgeCheck className="text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="inline-flex font-bold">
            <CountAnimation
              number={data?.countApplicationsCompleted}
              className="text-2xl"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Đơn đã thụ lý và hoàn thành
          </p>
        </CardContent>
      </Card> */}
    </div>
  );
}
