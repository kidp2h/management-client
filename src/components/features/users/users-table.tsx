import type { User } from '@clerk/nextjs/server';
import React from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreateUserForm from './create-user-form';
import { DeleteUsersDialog } from './delete-user-dialog';
import { getColumns } from './users-table-column';

interface UsersTableProps {
  users: User[];
  pageCount: number;
}
export const UsersTable = ({ users, pageCount }: UsersTableProps) => {
  // const { data } = use(users);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();
  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Tài khoản',
      value: 'username',
      description: 'Tài khoản phải lớn hơn 3 ký tự',
      placeholder: 'Tìm kiếm theo tài khoản',
    },
  ];
  const { table } = useDataTable({
    data: users,
    columns,
    enableAdvancedFilter: featureFlags.includes('advancedFilter'),
    pageCount,
    filterFields: [],
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
    initialState: {
      sorting: [{ id: 'createdAt', desc: true }],
      columnPinning: { right: ['actions'], left: ['select'] },
    },
    shallow: false,
    clearOnDefault: true,
  });
  console.log(users);
  // console.log(table);
  return (
    <DataTable table={table}>
      <DataTableToolbarActions
        table={table}
        fileNameExport="users"
        createDialog={
          <CreateDataDialog
            form={CreateUserForm}
            name="Tài khoản"
            description="Tạo mới tài khoản"
          />
        }
        deleteDialog={
          <DeleteUsersDialog
            name="tài khoản"
            users={table
              .getFilteredSelectedRowModel()
              .rows.map(row => row.original)}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />
        }
      />
      <DataTableAdvancedToolbar
        table={table}
        filterFields={filterFields}
        btnView
      />
    </DataTable>
  );
};
