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
import { getAllSalaryGrades } from '@/db/queries/salary-grades';
import { getAllCivilServantRanks } from '@/db/queries/civil-servant-ranks';
import { getAllPublicEmployeeRanks } from '@/db/queries/public-employee-ranks';

export interface RecordSalarySectionProps {
  salaries: ReturnType<typeof getSalariesRecordById>;
  allowances: ReturnType<typeof getAllowancesRecordById>;
  houses: ReturnType<typeof getHousesRecordById>;
  lands: ReturnType<typeof getLandsRecordById>;
  salaryGrades: ReturnType<typeof getAllSalaryGrades>;
  civilServantRanks: ReturnType<typeof getAllCivilServantRanks>;
  publicEmployeeRanks: ReturnType<typeof getAllPublicEmployeeRanks>;
  id: string;
}

export default function RecordSalarySection({
  salaries,
  allowances,
  houses,
  salaryGrades,
  civilServantRanks,
  publicEmployeeRanks,
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
        <RecordSalaryTable
          salaries={salaries}
          id={id}
          civilServantRanks={civilServantRanks}
          publicEmployeeRanks={publicEmployeeRanks}
          salaryGrades={salaryGrades}
        />
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
    </div>
  );
}
