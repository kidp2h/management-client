'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getFormCommendations } from '@/db/queries/form-commendations';
import type { FormCommendations } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreateFormCommendationForm from './create-form-commendation-form';
import { DeleteFormCommendationsDialog } from './delete-form-commendations-dialog';
import { getColumns } from './form-commendations-table-column';

interface FormCommendationsTableProps {
  formCommendations: ReturnType<typeof getFormCommendations>;
}
export const FormCommendationsTable = ({
  formCommendations,
}: FormCommendationsTableProps) => {
  const { data, pageCount } = use(formCommendations);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Hình thức khen thưởng',
      value: 'name',
      placeholder: 'Tìm kiếm theo tên hình thức khen thưởng',
    },
    {
      label: 'Mã hình thức khen thưởng',
      value: 'code',
      placeholder: 'Tìm kiếm theo mã hình thức khen thưởng',
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
        <DataTableToolbarActions<FormCommendations>
          table={table}
          fileNameExport="formCommendations"
          createDialog={
            <CreateDataDialog
              form={CreateFormCommendationForm}
              name="Hình thức khen thưởng"
              description="Tạo mới hình thức khen thưởng"
            />
          }
          deleteDialog={
            <DeleteFormCommendationsDialog
              name="hình thức khen thưởng"
              formCommendations={table
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
