'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getSalaryGrades } from '@/db/queries/salary-grades';
import type { SalaryGrades } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreateSalaryGradeForm from './create-salary-grade-form';
import { DeleteSalaryGradesDialog } from './delete-salary-grades-dialog';
import { getColumns } from './salary-grades-table-column';

interface SalaryGradesTableProps {
  salaryGrades: ReturnType<typeof getSalaryGrades>;
}
export const SalaryGradesTable = ({ salaryGrades }: SalaryGradesTableProps) => {
  const { data, pageCount } = use(salaryGrades);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Bậc lương',
      value: 'name',
      placeholder: 'Tìm kiếm theo tên bậc lương',
    },
    {
      label: 'Mã bậc lương',
      value: 'code',
      placeholder: 'Tìm kiếm theo mã bậc lương',
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
        <DataTableToolbarActions<SalaryGrades>
          table={table}
          fileNameExport="salaryGrades"
          createDialog={
            <CreateDataDialog
              form={CreateSalaryGradeForm}
              name="Bậc lương"
              description="Tạo mới bậc lương"
            />
          }
          deleteDialog={
            <DeleteSalaryGradesDialog
              name="bậc lương"
              salaryGrades={table
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
