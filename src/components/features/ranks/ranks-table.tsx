'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getRanks } from '@/db/queries/ranks';
import type { Ranks } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreateRankForm from './create-rank-form';
import { DeleteRanksDialog } from './delete-rank-dialog';
import { getColumns } from './ranks-table-column';

interface RanksTableProps {
  ranks: ReturnType<typeof getRanks>;
}
export const RanksTable = ({ ranks }: RanksTableProps) => {
  const { data, pageCount } = use(ranks);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Tên cấp bậc',
      value: 'name',
      placeholder: 'Tìm kiếm theo tên cấp bậc',
    },
    {
      label: 'Mã cấp bậc',
      value: 'code',
      placeholder: 'Tìm kiếm theo mã cấp bậc',
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
        <DataTableToolbarActions<Ranks>
          table={table}
          fileNameExport="ranks"
          createDialog={
            <CreateDataDialog
              form={CreateRankForm}
              name="Cấp bậc"
              description="Tạo mới cấp bậc"
            />
          }
          deleteDialog={
            <DeleteRanksDialog
              name="cấp bậc"
              ranks={table
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
