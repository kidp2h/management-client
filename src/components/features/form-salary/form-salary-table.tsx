'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getFormSalary } from '@/db/queries/form-salary';
import type { FormSalary } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreateFormSalaryForm from './create-form-salary-form';
import { DeleteFormSalaryDialog } from './delete-form-salary-dialog';
import { getColumns } from './form-salary-table-column';

interface FormSalaryTableProps {
  formSalary: ReturnType<typeof getFormSalary>;
}
export const FormSalaryTable = ({ formSalary }: FormSalaryTableProps) => {
  const { data, pageCount } = use(formSalary);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Hình thức hưởng lương',
      value: 'name',
      placeholder: 'Tìm kiếm theo tên hình thức hưởng lương',
    },
    {
      label: 'Mã hình thức hưởng lương',
      value: 'code',
      placeholder: 'Tìm kiếm theo mã hình thức hưởng lương',
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
        <DataTableToolbarActions<FormSalary>
          table={table}
          fileNameExport="formSalary"
          createDialog={
            <CreateDataDialog
              form={CreateFormSalaryForm}
              name="Hình thức hưởng lương"
              description="Tạo mới hình thức hưởng lương"
            />
          }
          deleteDialog={
            <DeleteFormSalaryDialog
              name="hình thức hưởng lương"
              formSalary={table
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
