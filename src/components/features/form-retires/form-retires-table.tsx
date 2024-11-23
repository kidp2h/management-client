'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getFormRetires } from '@/db/queries/form-retires';
import type { FormRetires } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreateFormRetireForm from './create-form-retire-form';
import { DeleteFormRetiresDialog } from './delete-form-retires-dialog';
import { getColumns } from './form-retires-table-column';

interface FormRetiresTableProps {
  formRetires: ReturnType<typeof getFormRetires>;
}
export const FormRetiresTable = ({ formRetires }: FormRetiresTableProps) => {
  const { data, pageCount } = use(formRetires);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Hình thức nghỉ hưu',
      value: 'name',
      placeholder: 'Tìm kiếm theo tên hình thức nghỉ hưu',
    },
    {
      label: 'Mã hình thức nghỉ hưu',
      value: 'code',
      placeholder: 'Tìm kiếm theo mã hình thức nghỉ hưu',
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
        <DataTableToolbarActions<FormRetires>
          table={table}
          fileNameExport="formRetires"
          createDialog={
            <CreateDataDialog
              form={CreateFormRetireForm}
              name="Hình thức nghỉ hưu"
              description="Tạo mới hình thức nghỉ hưu"
            />
          }
          deleteDialog={
            <DeleteFormRetiresDialog
              name="hình thức nghỉ hưu"
              formRetires={table
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
