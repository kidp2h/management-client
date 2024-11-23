'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getDuties } from '@/db/queries/duties';
import type { Duties } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreateDutyForm from './create-duty-form';
import { DeleteDutiesDialog } from './delete-duty-dialog';
import { getColumns } from './duties-table-column';

interface DutiesTableProps {
  duties: ReturnType<typeof getDuties>;
}
export const DutiesTable = ({ duties }: DutiesTableProps) => {
  const { data, pageCount } = use(duties);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Tên chức vụ',
      value: 'name',
      placeholder: 'Tìm kiếm theo tên chức vụ',
    },
    {
      label: 'Mã chức vụ',
      value: 'code',
      placeholder: 'Tìm kiếm theo mã chức vụ',
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
        <DataTableToolbarActions<Duties>
          table={table}
          fileNameExport="duties"
          createDialog={
            <CreateDataDialog
              form={CreateDutyForm}
              name="Chức vụ"
              description="Tạo mới chức vụ"
            />
          }
          deleteDialog={
            <DeleteDutiesDialog
              name="chức vụ"
              duties={table
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
