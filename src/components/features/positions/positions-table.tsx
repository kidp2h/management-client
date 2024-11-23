'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getPositions } from '@/db/queries/positions';
import type { Positions } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreatePositionForm from './create-position-form';
import { DeletePositionsDialog } from './delete-positions-dialog';
import { getColumns } from './positions-table-column';

interface PositionsTableProps {
  positions: ReturnType<typeof getPositions>;
}
export const PositionsTable = ({ positions }: PositionsTableProps) => {
  const { data, pageCount } = use(positions);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Tên vị trí việc làm',
      value: 'name',
      placeholder: 'Tìm kiếm theo tên vị trí việc làm',
    },
    {
      label: 'Mã vị trí việc làm',
      value: 'code',
      placeholder: 'Tìm kiếm theo mã vị trí việc làm',
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
        <DataTableToolbarActions<Positions>
          table={table}
          fileNameExport="positions"
          createDialog={
            <CreateDataDialog
              form={CreatePositionForm}
              name="Vị trí việc làm"
              description="Tạo mới vị trí việc làm"
            />
          }
          deleteDialog={
            <DeletePositionsDialog
              name="vị trí việc làm"
              positions={table
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
