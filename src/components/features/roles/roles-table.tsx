'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getRoles } from '@/db/queries/roles';
import type { Roles } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreateRoleForm from './create-role-form';
import { DeleteRolesDialog } from './delete-role-dialog';
import { getColumns } from './roles-table-column';

interface RolesTableProps {
  roles: ReturnType<typeof getRoles>;
}
export const RolesTable = ({ roles }: RolesTableProps) => {
  const { data, pageCount } = use(roles);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Tên vai trò',
      value: 'name',
      placeholder: 'Tìm kiếm theo tên vai trò',
    },
    {
      label: 'Mã vai trò',
      value: 'code',
      placeholder: 'Tìm kiếm theo mã vai trò',
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
        <DataTableToolbarActions<Roles>
          table={table}
          fileNameExport="roles"
          createDialog={
            <CreateDataDialog
              form={CreateRoleForm}
              name="Vai trò"
              description="Tạo mới vai trò"
            />
          }
          deleteDialog={
            <DeleteRolesDialog
              name="vai trò"
              roles={table
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
