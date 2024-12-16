import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';
import IncreaseSalaryRegularEligibleTable from './increase-salary-regular-eligible-table';
import { getAllIncreasedSalaryRegular, getRecords } from '@/db/queries/records';
import { getAllSalaryGrades } from '@/db/queries/salary-grades';
import IncreasedSalaryRegularTable from './increased-salary-regular-table';

export interface IncreaseSalaryRegularSectionProps {
  records: ReturnType<typeof getRecords>;
  salaryGrades: ReturnType<typeof getAllSalaryGrades>;
  listIncreasedSalaryRegular: ReturnType<typeof getAllIncreasedSalaryRegular>;
  cDepartment: any;
}

export default function IncreaseSalaryRegularSection({
  records,
  salaryGrades,
  listIncreasedSalaryRegular,
  cDepartment,
}: IncreaseSalaryRegularSectionProps) {
  const [tab, setTab] = React.useState('list');
  return (
    <div>
      <Tabs value={tab} onValueChange={setTab} defaultValue="list">
        <TabsList className="flex flex-row h-full justify-start items-start w-fit mb-5">
          <ScrollArea>
            <TabsTrigger value="list">Danh sách đủ điều kiện</TabsTrigger>

            <TabsTrigger value="increased">
              Lịch sử nâng lương thường xuyên
            </TabsTrigger>
          </ScrollArea>
        </TabsList>
        <TabsContent value="list" className="w-full">
          <IncreaseSalaryRegularEligibleTable
            cDepartment={cDepartment}
            records={records}
            salaryGrades={salaryGrades}
          />
        </TabsContent>
        <TabsContent value="increased" className="w-full">
          <IncreasedSalaryRegularTable
            listIncreasedSalaryRegular={listIncreasedSalaryRegular}
            cDepartment={cDepartment}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
