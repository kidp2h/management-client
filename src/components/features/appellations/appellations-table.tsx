'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getAppellations } from '@/db/queries/appellations';
import type { Appellations } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreateAppellationForm from './create-appellation-form';
import { DeleteAppellationsDialog } from './delete-appellations-dialog';
import { getColumns } from './appellations-table-column';

interface AppellationsTableProps {
  appellations: ReturnType<typeof getAppellations>;
}
export const AppellationsTable = ({ appellations }: AppellationsTableProps) => {
  const { data, pageCount } = use(appellations);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Tên danh hiệu',
      value: 'name',
      placeholder: 'Tìm kiếm theo tên danh hiệu',
    },
    {
      label: 'Mã danh hiệu',
      value: 'code',
      placeholder: 'Tìm kiếm theo mã danh hiệu',
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
        <DataTableToolbarActions<Appellations>
          table={table}
          fileNameExport="appellations"
          createDialog={
            <CreateDataDialog
              form={CreateAppellationForm}
              name="Danh hiệu"
              description="Tạo mới danh hiệu"
            />
          }
          deleteDialog={
            <DeleteAppellationsDialog
              name="danh hiệu"
              appellations={table
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
