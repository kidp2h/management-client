import React from 'react';

import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getRelativesRecordById } from '@/db/queries/records';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';

import { getColumns } from './record-relative-table-column';
import { CreateDataDialog } from '@/components/common/create-data-dialog';
import CreateRelativeForm from './create-relative-form';
import { DeleteRelativesDialog } from './delete-relative-dialog';

export interface RecordRelativeTableProps {
  relatives: ReturnType<typeof getRelativesRecordById>;
  id: string;
}
export default function RecordRelativeTable({
  relatives,
  id,
}: RecordRelativeTableProps) {
  console.log(id);
  const { data } = React.use(relatives);
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
              name="nhân thân"
              form={CreateRelativeForm}
              description="Tạo nhân thân"
              data={{
                recordId: id,
              }}
            />
          }
          deleteDialog={
            <DeleteRelativesDialog
              name="nhân thân"
              relatives={table
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
