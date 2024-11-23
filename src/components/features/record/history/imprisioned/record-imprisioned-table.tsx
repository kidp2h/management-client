import React from 'react';

import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getImprisionedsRecordById } from '@/db/queries/records';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';

import { getColumns } from './record-imprisioned-table-column';
import { CreateDataDialog } from '@/components/common/create-data-dialog';
import CreateImprisionedForm from './create-imprisioned-form';
import { DeleteImprisionedsDialog } from './delete-imprisioned-dialog';

export interface RecordImprisionedTableProps {
  imprisioneds: ReturnType<typeof getImprisionedsRecordById>;
  id: string;
}
export default function RecordImprisionedTable({
  imprisioneds,
  id,
}: RecordImprisionedTableProps) {
  console.log(id);
  const { data } = React.use(imprisioneds);
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
              name="lịch sử cá nhân"
              form={CreateImprisionedForm}
              description="Tạo lịch sử cá nhân"
              data={{
                recordId: id,
              }}
            />
          }
          deleteDialog={
            <DeleteImprisionedsDialog
              name="lịch sử cá nhân"
              imprisioneds={table
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
