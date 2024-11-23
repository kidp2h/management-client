import { Separator } from '@/components/ui/separator';
import React from 'react';
import RecordOldRegimeTable from './old-regime/record-old-regime-table';
import RecordImprisionedTable from './imprisioned/record-imprisioned-table';
import {
  getImprisionedsRecordById,
  getOldRegimesRecordById,
} from '@/db/queries/records';

export interface RecordHistorySectionProps {
  imprisioneds: ReturnType<typeof getImprisionedsRecordById>;
  oldRegimes: ReturnType<typeof getOldRegimesRecordById>;
  id: string;
}
export default function RecordHistorySection({
  imprisioneds,
  oldRegimes,
  id,
}: RecordHistorySectionProps) {
  return (
    <div>
      <span className="font-bold text-xl">a) Khai rõ: bị bắt, bị tù</span>
      <Separator className="my-3" />
      <RecordImprisionedTable id={id} imprisioneds={imprisioneds} />
      <span className="font-bold text-xl mt-10 block">
        b) Bản thân có làm việc trong chế độ cũ
      </span>
      <Separator className="my-3" />
      <RecordOldRegimeTable id={id} oldRegimes={oldRegimes} />
    </div>
  );
}
