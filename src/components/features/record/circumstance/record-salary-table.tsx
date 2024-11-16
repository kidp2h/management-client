'use client';
import React from 'react';
import { getColumns } from './record-salary-table-column';
import { useTable } from '@/providers/table-provider';
import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { getSalariesRecordById } from '@/db/queries/records';
import { CreateDataDialog } from '@/components/common/create-data-dialog';
import CreateSalaryForm from './create-salary-form';
import { DeleteSalariesDialog } from './delete-salaries-dialog';

export interface RecordSalaryTableProps {
  salaries: ReturnType<typeof getSalariesRecordById>;
  id: string;
}
export default function RecordSalaryTable({
  salaries,
  id,
}: RecordSalaryTableProps) {
  const { data } = React.use(salaries);
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
    <DataTable table={table} pagination={false}>
      <DataTableAdvancedToolbar table={table} filterFields={[]}>
        <DataTableToolbarActions
          table={table}
          createDialog={
            <CreateDataDialog
              name="quá trình lương"
              form={CreateSalaryForm}
              description="Tạo quá trình lương"
              data={{
                recordId: id,
              }}
            />
          }
          deleteDialog={
            <DeleteSalariesDialog
              name="quá trình lương"
              salaries={table
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
