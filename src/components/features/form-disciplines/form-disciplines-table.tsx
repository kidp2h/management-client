'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getFormDisciplines } from '@/db/queries/form-disciplines';
import type { FormDisciplines } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreateFormDisciplineForm from './create-form-discipline-form';
import { DeleteFormDisciplinesDialog } from './delete-form-disciplines-dialog';
import { getColumns } from './form-disciplines-table-column';

interface FormDisciplinesTableProps {
  formDisciplines: ReturnType<typeof getFormDisciplines>;
}
export const FormDisciplinesTable = ({
  formDisciplines,
}: FormDisciplinesTableProps) => {
  const { data, pageCount } = use(formDisciplines);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Hình thức kỷ luật',
      value: 'name',
      placeholder: 'Tìm kiếm theo tên hình thức kỷ luật',
    },
    {
      label: 'Mã hình thức kỷ luật',
      value: 'code',
      placeholder: 'Tìm kiếm theo mã hình thức kỷ luật',
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
        <DataTableToolbarActions<FormDisciplines>
          table={table}
          fileNameExport="formDisciplines"
          createDialog={
            <CreateDataDialog
              form={CreateFormDisciplineForm}
              name="Hình thức kỷ luật"
              description="Tạo mới hình thức kỷ luật"
            />
          }
          deleteDialog={
            <DeleteFormDisciplinesDialog
              name="hình thức kỷ luật"
              formDisciplines={table
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
