'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getPublicEmployeeRanks } from '@/db/queries/public-employee-ranks';
import type { PublicEmployeeRanks } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreatePublicEmployeeRankForm from './create-public-employee-rank-form';
import { DeletePublicEmployeeRanksDialog } from './delete-public-employee-ranks-dialog';
import { getColumns } from './public-employee-ranks-table-column';

interface PublicEmployeeRanksTableProps {
  publicEmployeeRanks: ReturnType<typeof getPublicEmployeeRanks>;
}
export const PublicEmployeeRanksTable = ({
  publicEmployeeRanks,
}: PublicEmployeeRanksTableProps) => {
  const { data, pageCount } = use(publicEmployeeRanks);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Ngạch viên chức',
      value: 'name',
      placeholder: 'Tìm kiếm theo tên gia đình xuất thân',
    },
    {
      label: 'Mã gia đình xuất thân',
      value: 'code',
      placeholder: 'Tìm kiếm theo mã gia đình xuất thân',
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
        <DataTableToolbarActions<PublicEmployeeRanks>
          table={table}
          fileNameExport="publicEmployeeRanks"
          createDialog={
            <CreateDataDialog
              form={CreatePublicEmployeeRankForm}
              name="Ngạch viên chức"
              description="Tạo mới gia đình xuất thân"
            />
          }
          deleteDialog={
            <DeletePublicEmployeeRanksDialog
              name="gia đình xuất thân"
              publicEmployeeRanks={table
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
