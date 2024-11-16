import { Separator } from '@/components/ui/separator';
import React from 'react';
import RecordSalaryTable from './record-salary-table';
import {
  getAllowancesRecordById,
  getHousesRecordById,
  getLandsRecordById,
  getSalariesRecordById,
} from '@/db/queries/records';
import RecordAllowanceTable from './record-allowance-table';
import RecordHouseTable from './record-house-table';

export interface RecordSalarySectionProps {
  salaries: ReturnType<typeof getSalariesRecordById>;
  allowances: ReturnType<typeof getAllowancesRecordById>;
  houses: ReturnType<typeof getHousesRecordById>;
  lands: ReturnType<typeof getLandsRecordById>;
  id: string;
}

export default function RecordSalarySection({
  salaries,
  allowances,
  houses,
  lands,
  id,
}: RecordSalarySectionProps) {
  return (
    <div className="mt-10">
      <span className="text-2xl font-bold mb-16 block">
        Hoàn cảnh kinh tế gia đình
      </span>
      <span className="block text-xl font-bold mb-5">Quá trình lương</span>
      <Separator />
      <div className="my-5">
        <RecordSalaryTable salaries={salaries} id={id} />
      </div>
      <span className="block text-xl font-bold mb-5">Quá trình phụ cấp</span>
      <Separator />
      <div className="my-5">
        <RecordAllowanceTable allowances={allowances} id={id} />
      </div>
      <span className="block text-xl font-bold mb-5">Nhà ở</span>
      <Separator />
      <div className="my-5">
        <RecordHouseTable houses={houses} id={id} />
      </div>
      <span className="block text-xl font-bold mb-5">Đất ở</span>
      <Separator />
      <div className="my-5"></div>
    </div>
  );
}
