import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';
import IncreaseSalaryEarlyEligibleTable from './increase-salary-early-eligible-table';
import { getAllIncreasedSalaryEarly, getRecords } from '@/db/queries/records';
import { getAllSalaryGrades } from '@/db/queries/salary-grades';
import IncreasedSalaryEarlyTable from './increased-salary-early-table';

export interface IncreaseSalaryEarlySectionProps {
  records: ReturnType<typeof getRecords>;
  salaryGrades: ReturnType<typeof getAllSalaryGrades>;
  listIncreasedSalaryEarly: ReturnType<typeof getAllIncreasedSalaryEarly>;
  cDepartment: any;
}

export default function IncreaseSalaryEarlySection({
  records,
  salaryGrades,
  listIncreasedSalaryEarly,
  cDepartment,
}: IncreaseSalaryEarlySectionProps) {
  const [tab, setTab] = React.useState('list');
  return (
    <div>
      <Tabs value={tab} onValueChange={setTab} defaultValue="list">
        <TabsList className="flex flex-row h-full justify-start items-start w-fit mb-5">
          <ScrollArea>
            <TabsTrigger value="list">Danh sách đủ điều kiện</TabsTrigger>

            <TabsTrigger value="increased">
              Lịch sử nâng lương trước hạn
            </TabsTrigger>
          </ScrollArea>
        </TabsList>
        <TabsContent value="list" className="w-full">
          <IncreaseSalaryEarlyEligibleTable
            cDepartment={cDepartment}
            records={records}
            salaryGrades={salaryGrades}
          />
        </TabsContent>
        <TabsContent value="increased" className="w-full">
          <IncreasedSalaryEarlyTable
            listIncreasedSalaryEarly={listIncreasedSalaryEarly}
            cDepartment={cDepartment}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
