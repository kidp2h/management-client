'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getEthnicities } from '@/db/queries/ethnicities';
import type { Ethnicities } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreateEthnicityForm from './create-ethnicity-form';
import { DeleteEthnicitiesDialog } from './delete-ethnicities-dialog';
import { getColumns } from './ethnicities-table-column';

interface EthnicitiesTableProps {
  ethnicities: ReturnType<typeof getEthnicities>;
}
export const EthnicitiesTable = ({ ethnicities }: EthnicitiesTableProps) => {
  const { data, pageCount } = use(ethnicities);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Tên dân tộc',
      value: 'name',
      placeholder: 'Tìm kiếm theo tên dân tộc',
    },
    {
      label: 'Mã dân tộc',
      value: 'code',
      placeholder: 'Tìm kiếm theo mã dân tộc',
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
        <DataTableToolbarActions<Ethnicities>
          table={table}
          fileNameExport="ethnicities"
          createDialog={
            <CreateDataDialog
              form={CreateEthnicityForm}
              name="Dân tộc"
              description="Tạo mới dân tộc"
            />
          }
          deleteDialog={
            <DeleteEthnicitiesDialog
              name="dân tộc"
              ethnicities={table
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
