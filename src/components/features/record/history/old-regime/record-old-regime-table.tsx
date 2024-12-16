import React from 'react';

import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getOldRegimesRecordById } from '@/db/queries/records';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';

import { getColumns } from './record-old-regime-table-column';
import { CreateDataDialog } from '@/components/common/create-data-dialog';
import CreateOldRegimeForm from './create-old-regime-form';
import { DeleteOldRegimesDialog } from './delete-old-regimes-dialog';

export interface RecordOldRegimeTableProps {
  oldRegimes: ReturnType<typeof getOldRegimesRecordById>;
  id: string;
}
export default function RecordOldRegimeTable({
  oldRegimes,
  id,
}: RecordOldRegimeTableProps) {
  // console.log(id);
  const { data } = React.use(oldRegimes);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();
  const { table } = useDataTable({
    pageCount: 1,
    data: data || [],
    columns,
    enableAdvancedFilter: featureFlags.includes('advancedFilter'),
    filterFields: [],
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
      <DataTableAdvancedToolbar table={table} filterFields={[]}>
        <DataTableToolbarActions
          table={table}
          createDialog={
            <CreateDataDialog
              name="chế độ cũ"
              form={CreateOldRegimeForm}
              description="Tạo dữ liệu"
              data={{
                recordId: id,
              }}
            />
          }
          deleteDialog={
            <DeleteOldRegimesDialog
              name="chế độ cũ"
              oldRegimes={table
                .getFilteredSelectedRowModel()
                .rows.map(row => row.original)}
              onSuccess={() => table.toggleAllRowsSelected(false)}
            />
          }
        />
      </DataTableAdvancedToolbar>
    </DataTable>
  );
}
