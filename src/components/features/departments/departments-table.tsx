'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getDepartments } from '@/db/queries/departments';
import type { Departments } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreateDepartmentForm from './create-department-form';
import { DeleteDepartmentsDialog } from './delete-departments-dialog';
import { getColumns } from './departments-table-column';

interface DepartmentsTableProps {
  departments: ReturnType<typeof getDepartments>;
}
export const DepartmentsTable = ({ departments }: DepartmentsTableProps) => {
  const { data, pageCount } = use(departments);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Tên đơn vị',
      value: 'name',
      placeholder: 'Tìm kiếm theo tên đơn vị',
    },
    {
      label: 'Mã đơn vị',
      value: 'code',
      placeholder: 'Tìm kiếm theo mã đơn vị',
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
        <DataTableToolbarActions<Departments>
          table={table}
          fileNameExport="departments"
          createDialog={
            <CreateDataDialog
              form={CreateDepartmentForm}
              name="Đơn vị"
              description="Tạo mới đơn vị"
            />
          }
          deleteDialog={
            <DeleteDepartmentsDialog
              name="đơn vị"
              departments={table
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
