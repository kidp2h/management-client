'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getSalaries } from '@/db/queries/salaries';
import type { Salaries } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreateSalaryForm from './create-salary-form';
import { DeleteSalariesDialog } from './delete-salaries-dialog';
import { getColumns } from './salaries-table-column';
import { getAllSalaryGrades } from '@/db/queries/salary-grades';

interface SalariesTableProps {
  salaries: ReturnType<typeof getSalaries>;
  grades: ReturnType<typeof getAllSalaryGrades>;
}
export const SalariesTable = ({ salaries, grades }: SalariesTableProps) => {
  const { data, pageCount } = use(salaries);
  const columns = React.useMemo(() => getColumns(grades || []), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Tên',
      value: 'salary',
      placeholder: 'Tìm kiếm theo mức lương',
    },
  ];
  // const Toolbar = featureFlags.includes('advancedFilter')
  //   ? DataTableAdvancedToolbar
  //   : DataTableToolbar;
  const { table } = useDataTable({
    data,
    columns,
    enableAdvancedFilter: featureFlags.includes('advancedFilter'),
    pageCount,
    filterFields,
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
      columnPinning: { right: ['actions'], left: ['select'] },
    },
    shallow: false,
    clearOnDefault: true,
  });
  return (
    <DataTable table={table}>
      <DataTableAdvancedToolbar table={table} filterFields={filterFields}>
        <DataTableToolbarActions<Salaries>
          table={table}
          fileNameExport="salaries"
          createDialog={
            <CreateDataDialog
              form={CreateSalaryForm}
              name="Lương"
              description="Tạo mới lương"
              data={{ grades }}
            />
          }
          deleteDialog={
            <DeleteSalariesDialog
              name="lương"
              salaries={table
                .getFilteredSelectedRowModel()
                .rows.map(row => row.original)}
              onSuccess={() => table.toggleAllRowsSelected(false)}
            />
          }
        />
      </DataTableAdvancedToolbar>
    </DataTable>
  );
};
