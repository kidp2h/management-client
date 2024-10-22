'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getPermissions } from '@/db/queries/permissions';
import type { Permissions } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreatePermissionForm from './create-permission-form';
import { DeletePermissionsDialog } from './delete-permission-dialog';
import { getColumns } from './permissions-table-column';

interface PermissionsTableProps {
  permissions: ReturnType<typeof getPermissions>;
}
export const PermissionsTable = ({ permissions }: PermissionsTableProps) => {
  const { data, pageCount } = use(permissions);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Tên quyền',
      value: 'name',
      placeholder: 'Tìm kiếm theo tên quyền',
    },
    {
      label: 'Mã quyền',
      value: 'code',
      placeholder: 'Tìm kiếm theo mã quyền',
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
        <DataTableToolbarActions<Permissions>
          table={table}
          fileNameExport="permissions"
          createDialog={
            <CreateDataDialog
              form={CreatePermissionForm}
              name="Quyền"
              description="Tạo mới quyền"
            />
          }
          deleteDialog={
            <DeletePermissionsDialog
              name="quyền"
              permissions={table
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
