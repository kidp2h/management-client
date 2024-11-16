'use client';
import React from 'react';
import { getColumns } from './record-allowance-table-column';
import { useTable } from '@/providers/table-provider';
import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { getAllowancesRecordById } from '@/db/queries/records';
import { CreateDataDialog } from '@/components/common/create-data-dialog';
import CreateAllowanceForm from './create-allowance-form';
import { DeleteAllowancesDialog } from './delete-allowances-dialog';

export interface RecordAllowanceTableProps {
  allowances: ReturnType<typeof getAllowancesRecordById>;
  id: string;
}
export default function RecordAllowanceTable({
  allowances,
  id,
}: RecordAllowanceTableProps) {
  const { data } = React.use(allowances);
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
              name="quá trình trợ cấp"
              form={CreateAllowanceForm}
              description="quá trình trợ cấp mới"
              data={{
                recordId: id,
              }}
            />
          }
          deleteDialog={
            <DeleteAllowancesDialog
              name="quá trình trợ cấp"
              allowances={table
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
