'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getFamilyBackgrounds } from '@/db/queries/family-backgrounds';
import type { FamilyBackgrounds } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreateFamilyBackgroundForm from './create-family-background-form';
import { DeleteFamilyBackgroundsDialog } from './delete-family-backgrounds-dialog';
import { getColumns } from './family-backgrounds-table-column';

interface FamilyBackgroundsTableProps {
  familyBackgrounds: ReturnType<typeof getFamilyBackgrounds>;
}
export const FamilyBackgroundsTable = ({
  familyBackgrounds,
}: FamilyBackgroundsTableProps) => {
  const { data, pageCount } = use(familyBackgrounds);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Tên gia đình xuất thân',
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
        <DataTableToolbarActions<FamilyBackgrounds>
          table={table}
          fileNameExport="familyBackgrounds"
          createDialog={
            <CreateDataDialog
              form={CreateFamilyBackgroundForm}
              name="Gia đình xuất thân"
              description="Tạo mới gia đình xuất thân"
            />
          }
          deleteDialog={
            <DeleteFamilyBackgroundsDialog
              name="gia đình xuất thân"
              familyBackgrounds={table
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
