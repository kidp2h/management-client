import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { getColumns } from './increase-salary-early-eligible-table-column';
import React from 'react';
import { DataTableFilterField } from '@/types';
import { useTable } from '@/providers/table-provider';
import { getRecords } from '@/db/queries/records';
import { extractDateParts } from '@/lib/utils';
import { differenceInDays } from 'date-fns';
import { getAllSalaryGrades } from '@/db/queries/salary-grades';

export interface IncreaseSalaryEarlyEligibleTableProps {
  records: ReturnType<typeof getRecords>;
  salaryGrades: ReturnType<typeof getAllSalaryGrades>;
  cDepartment: any;
}

export default function IncreaseSalaryEarlyEligibleTable({
  records,
  salaryGrades,
  cDepartment,
}: IncreaseSalaryEarlyEligibleTableProps) {
  const columns = getColumns(salaryGrades, cDepartment);
  const { featureFlags } = useTable();
  const { data } = React.use(records);
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
  const now = new Date();
  console.log(data);
  const { table } = useDataTable({
    // data: data?.filter(d => d.department.id === cDepartment?.id) || [],
    data: data
      .filter(
        (item, index, self) =>
          self.findIndex(t => t?.record?.id === item?.record?.id) === index,
      )
      .filter(i => {
        if (i?.department?.id !== cDepartment?.id) return false;
        const partDateAppointment = extractDateParts(i?.dateOfAppointment);
        const currentYear = now.getFullYear();
        if (!partDateAppointment) return false;
        const newDateAppointment = new Date(
          currentYear,
          partDateAppointment.month - 1,
          partDateAppointment.day,
        );
        console.log('hi', i.lastIncreaseSalary);
        if (i.lastIncreaseSalary) {
          if (differenceInDays(now, i.lastIncreaseSalary) < 365) return false;
        }

        const diff = differenceInDays(newDateAppointment, now);
        if (diff < -90) return false;
        return true;
      }),
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
    <div>
      <DataTable table={table}>
        {/* <pre> {JSON.stringify(data, null, 2)}</pre>
          {cDepartment?.id} */}
        <DataTableToolbarActions table={table} />
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
    </div>
  );
}
