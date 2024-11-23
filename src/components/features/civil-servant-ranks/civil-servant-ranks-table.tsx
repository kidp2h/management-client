'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getCivilServantRanks } from '@/db/queries/civil-servant-ranks';
import type { CivilServantRanks } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreateCivilServantRankForm from './create-civil-servant-rank-form';
import { DeleteCivilServantRanksDialog } from './delete-civil-servant-ranks-dialog';
import { getColumns } from './civil-servant-ranks-table-column';

interface CivilServantRanksTableProps {
  civilServantRanks: ReturnType<typeof getCivilServantRanks>;
}
export const CivilServantRanksTable = ({
  civilServantRanks,
}: CivilServantRanksTableProps) => {
  const { data, pageCount } = use(civilServantRanks);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Ngạch công chức',
      value: 'name',
      placeholder: 'Tìm kiếm theo ngạch công chức',
    },
    {
      label: 'Mã ngạch công chức',
      value: 'code',
      placeholder: 'Tìm kiếm theo mã ngạch công chức',
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
        <DataTableToolbarActions<CivilServantRanks>
          table={table}
          fileNameExport="civilServantRanks"
          createDialog={
            <CreateDataDialog
              form={CreateCivilServantRankForm}
              name="Ngạch công chức"
              description="Tạo mới ngạch công chức"
            />
          }
          deleteDialog={
            <DeleteCivilServantRanksDialog
              name="ngạch công chức"
              civilServantRanks={table
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
