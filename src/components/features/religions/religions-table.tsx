'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getReligions } from '@/db/queries/religions';
import type { Religions } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreateReligionForm from './create-religion-form';
import { DeleteReligionsDialog } from './delete-religion-dialog';
import { getColumns } from './religions-table-column';

interface ReligionsTableProps {
  religions: ReturnType<typeof getReligions>;
}
export const ReligionsTable = ({ religions }: ReligionsTableProps) => {
  const { data, pageCount } = use(religions);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Tên tôn giáo',
      value: 'name',
      placeholder: 'Tìm kiếm theo tên tôn giáo',
    },
    {
      label: 'Mã tôn giáo',
      value: 'code',
      placeholder: 'Tìm kiếm theo mã tôn giáo',
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
        <DataTableToolbarActions<Religions>
          table={table}
          fileNameExport="religions"
          createDialog={
            <CreateDataDialog
              form={CreateReligionForm}
              name="Tôn giáo"
              description="Tạo mới tôn giáo"
            />
          }
          deleteDialog={
            <DeleteReligionsDialog
              name="tôn giáo"
              religions={table
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
