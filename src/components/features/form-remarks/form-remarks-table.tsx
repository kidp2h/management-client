'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getFormRemarks } from '@/db/queries/form-remarks';
import type { FormRemarks } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreateFormRemarkForm from './create-form-remark-form';
import { DeleteFormRemarksDialog } from './delete-form-remarks-dialog';
import { getColumns } from './form-remarks-table-column';

interface FormRemarksTableProps {
  formRemarks: ReturnType<typeof getFormRemarks>;
}
export const FormRemarksTable = ({ formRemarks }: FormRemarksTableProps) => {
  const { data, pageCount } = use(formRemarks);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Hình thức đánh giá',
      value: 'name',
      placeholder: 'Tìm kiếm theo tên hình thức đánh giá',
    },
    {
      label: 'Mã hình thức đánh giá',
      value: 'code',
      placeholder: 'Tìm kiếm theo mã hình thức đánh giá',
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
        <DataTableToolbarActions<FormRemarks>
          table={table}
          fileNameExport="formRemarks"
          createDialog={
            <CreateDataDialog
              form={CreateFormRemarkForm}
              name="Hình thức đánh giá"
              description="Tạo mới hình thức đánh giá"
            />
          }
          deleteDialog={
            <DeleteFormRemarksDialog
              name="hình thức đánh giá"
              formRemarks={table
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
