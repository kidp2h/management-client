import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { getColumns } from './increased-salary-early-table-column';
import React from 'react';
import { DataTableFilterField } from '@/types';
import { useTable } from '@/providers/table-provider';
import { getAllIncreasedSalaryEarly } from '@/db/queries/records';

export interface IncreaseSalaryEarlyEligibleTableProps {
  listIncreasedSalaryEarly: ReturnType<typeof getAllIncreasedSalaryEarly>;
  cDepartment: any;
}

export default function IncreasedSalaryEarlyTable({
  listIncreasedSalaryEarly,
  cDepartment,
}: IncreaseSalaryEarlyEligibleTableProps) {
  const columns = getColumns();
  const { featureFlags } = useTable();
  const { data } = React.use(listIncreasedSalaryEarly);
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
    data: data.filter(d => d?.department?.id === cDepartment?.id) || [],
    // data,

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
