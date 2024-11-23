import { Separator } from '@/components/ui/separator';
import React from 'react';
import RecordRelativeTable from './relative/record-relative-table';
import RecordOrganizationTable from './organization/record-organization-table';
import {
  getOrganizationsRecordById,
  getRelativesRecordById,
} from '@/db/queries/records';

export interface RecordAbroadSectionProps {
  organizations: ReturnType<typeof getOrganizationsRecordById>;
  relatives: ReturnType<typeof getRelativesRecordById>;
  id: string;
}
export default function RecordAbroadSection({
  organizations,
  relatives,
  id,
}: RecordAbroadSectionProps) {
  return (
    <div>
      <span className="font-bold text-xl">
        - Tham gia hoặc có quan hệ với các tổ chức chính trị, kinh tế, xã hội
        nào ở nước ngoài
      </span>
      <Separator className="my-3" />
      <RecordOrganizationTable id={id} organizations={organizations} />
      <span className="font-bold text-xl mt-10 block">- Có thân nhân</span>
      <Separator className="my-3" />
      <RecordRelativeTable id={id} relatives={relatives} />
    </div>
  );
}
