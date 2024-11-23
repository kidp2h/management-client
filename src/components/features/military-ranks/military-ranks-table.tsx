'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getMilitaryRanks } from '@/db/queries/military-ranks';
import type { MilitaryRanks } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreateMilitaryRankForm from './create-military-rank-form';
import { DeleteMilitaryRanksDialog } from './delete-military-ranks-dialog';
import { getColumns } from './military-ranks-table-column';

interface MilitaryRanksTableProps {
  militaryRanks: ReturnType<typeof getMilitaryRanks>;
}
export const MilitaryRanksTable = ({
  militaryRanks,
}: MilitaryRanksTableProps) => {
  const { data, pageCount } = use(militaryRanks);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Tên quân hàm',
      value: 'name',
      placeholder: 'Tìm kiếm theo tên quân hàm',
    },
    {
      label: 'Mã quân hàm',
      value: 'code',
      placeholder: 'Tìm kiếm theo mã quân hàm',
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
        <DataTableToolbarActions<MilitaryRanks>
          table={table}
          fileNameExport="militaryRanks"
          createDialog={
            <CreateDataDialog
              form={CreateMilitaryRankForm}
              name="Quân hàm"
              description="Tạo mới quân hàm"
            />
          }
          deleteDialog={
            <DeleteMilitaryRanksDialog
              name="quân hàm"
              militaryRanks={table
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
