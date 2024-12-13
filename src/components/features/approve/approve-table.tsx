'use client';

import React, { use } from 'react';

import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getAllApproves } from '@/db/queries/approves';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

// import CreateApproveForm from './create-department-form';
// import { DeleteApprovesDialog } from './delete-departments-dialog';
import { getColumns } from './approve-table-column';

interface ApprovesTableProps {
  approves: ReturnType<typeof getAllApproves>;
}
export const ApprovesTable = ({ approves }: ApprovesTableProps) => {
  const result = use(approves);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    // {
    //   label: 'Tên đơn vị',
    //   value: 'name',
    //   placeholder: 'Tìm kiếm theo tên đơn vị',
    // },
    // {
    //   label: 'Mã đơn vị',
    //   value: 'code',
    //   placeholder: 'Tìm kiếm theo mã đơn vị',
    // },
  ];
  // const Toolbar = featureFlags.includes('advancedFilter')
  //   ? DataTableAdvancedToolbar
  //   : DataTableToolbar;
  const { table } = useDataTable({
    data: result?.data || [],
    columns,
    enableAdvancedFilter: featureFlags.includes('advancedFilter'),
    pageCount: 0,
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
        <DataTableToolbarActions
          table={table}
          fileNameExport="approve"
          // createDialog={
          //   <CreateDataDialog
          //     form={CreateApproveForm}
          //     data={{ departments: allApproves }}
          //     name="Đơn vị"
          //     description="Tạo mới đơn vị"
          //   />
          // }
          // deleteDialog={
          //   <DeleteApprovesDialog
          //     name="đơn vị"
          //     departments={table
          //       .getFilteredSelectedRowModel()
          //       .rows.map(row => row.original)}
          //     onSuccess={() => table.toggleAllRowsSelected(false)}
          //   />
          // }
        />
      </DataTableAdvancedToolbar>
    </DataTable>
  );
};
