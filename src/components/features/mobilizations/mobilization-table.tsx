'use client';

import React, { use, useEffect } from 'react';

import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import type { Records } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import {
  getAllDepartments,
} from '@/db/queries/departments';
import { getColumns } from './mobilization-table-column';
import { getAllMobilizations } from '@/db/queries/mobilizations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getAllFormSalary } from '@/db/queries/form-salary';
import { getAllCivilServantRanks } from '@/db/queries/civil-servant-ranks';
import { getAllSalaryGrades } from '@/db/queries/salary-grades';
import { getAllDuties } from '@/db/queries/duties';

interface RecordsTableProps {
  cDepartment: Record<string, string>;
  departments: ReturnType<typeof getAllDepartments>;
  mobilizations: ReturnType<typeof getAllMobilizations>;
  formSalary: ReturnType<typeof getAllFormSalary>;
  civilServantRanks: ReturnType<typeof getAllCivilServantRanks>;
  salaryGrades: ReturnType<typeof getAllSalaryGrades>;
  duties: ReturnType<typeof getAllDuties>;
  childOfDepartments: any[];
}
export const MobilizationsTable = ({
  mobilizations,
  cDepartment,
  formSalary,
  civilServantRanks,
  salaryGrades,
  duties,
  childOfDepartments,
  departments,
}: RecordsTableProps) => {
  const { data } = use(mobilizations);
  const [dataFilter, setDataFilter] = React.useState<any>(
    data?.filter(d => d.department.id === cDepartment?.id),
  );

  console.log(data);
  const [tab, setTab] = React.useState('mobilizating');
  const { featureFlags } = useTable();

  // console.log('provinces', provinces);
  const columns = getColumns(
    tab,
    formSalary,
    civilServantRanks,
    salaryGrades,
    duties,
    childOfDepartments,
  );

  useEffect(() => {
    setTab('mobilizating');
    setDataFilter(data?.filter(d => d.department.id === cDepartment?.id));
  }, [cDepartment]);

  useEffect(() => {
    if (tab === 'mobilizated') {
      setDataFilter(data?.filter(d => d.fromDepartment.id === cDepartment?.id));
    } else {
      setDataFilter(data?.filter(d => d.department.id === cDepartment?.id));
    }
  }, [mobilizations]);
  const filterFieldsText: DataTableFilterField<any>[] = [
    // {
    //   label: 'Họ và tên',
    //   value: 'fullName',
    //   placeholder: 'Tìm kiếm theo họ và tên',
    // },
    // {
    //   label: 'Mã hồ sơ',
    //   value: 'code',
    //   placeholder: 'Tìm kiếm theo mã hồ sơ',
    // },
  ];
  const filterFieldsBox: DataTableFilterField<any>[] = [];

  const { table } = useDataTable({
    // data: data?.filter(d => d.department.id === cDepartment?.id) || [],
    data: dataFilter || [],
    columns,
    enableAdvancedFilter: featureFlags.includes('advancedFilter'),
    pageCount: 1,
    filterFields: [...filterFieldsText, ...filterFieldsBox],
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
      columnPinning: { right: ['actions'], left: ['select'] },
    },
    shallow: false,
    clearOnDefault: true,
  });
  return (
    <Tabs value={tab} onValueChange={setTab} defaultValue="info">
      <TabsList className="flex flex-row h-full justify-start items-start w-fit mb-5">
        <ScrollArea>
          <TabsTrigger
            value="mobilizating"
            onClick={() => {
              setDataFilter(
                data?.filter(d => d.department.id === cDepartment?.id),
              );
            }}
          >
            Danh sách được điều động đến đơn vị hiện tại
          </TabsTrigger>
          <TabsTrigger
            value="mobilizated"
            onClick={() => {
              setDataFilter(
                data?.filter(d => d.fromDepartment.id === cDepartment?.id),
              );
            }}
          >
            Danh sách đã điều động đến đơn vị khác
          </TabsTrigger>
        </ScrollArea>
      </TabsList>
      <TabsContent value="mobilizated">
        <DataTable table={table}>
          {/* <pre> {JSON.stringify(data, null, 2)}</pre>
          {cDepartment?.id} */}
          <DataTableToolbarActions<Records> table={table} />
          <DataTableAdvancedToolbar
            table={table}
            filterFields={filterFieldsText}
            btnView={false}
          >
            <DataTableToolbar
              table={table}
              filterFields={filterFieldsBox}
              btnView
            />
          </DataTableAdvancedToolbar>
        </DataTable>
      </TabsContent>
      <TabsContent value="mobilizating">
        <DataTable table={table}>
          {/* <pre> {JSON.stringify(data, null, 2)}</pre>
          {cDepartment?.id} */}
          <DataTableToolbarActions<Records> table={table} />
          <DataTableAdvancedToolbar
            table={table}
            filterFields={filterFieldsText}
            btnView={false}
          >
            <DataTableToolbar
              table={table}
              filterFields={filterFieldsBox}
              btnView
            />
          </DataTableAdvancedToolbar>
        </DataTable>
      </TabsContent>
    </Tabs>
  );
};
