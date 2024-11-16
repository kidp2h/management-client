'use client';
import React from 'react';
import { getColumns } from './record-relationship-table-column';
import { useTable } from '@/providers/table-provider';
import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { getRelationshipRecordById } from '@/db/queries/records';
import { CreateDataDialog } from '@/components/common/create-data-dialog';
import CreateRelationshipForm from './create-relationship-form';
import { DeleteRelationshipsDialog } from './delete-relationships-dialog';

export interface RecordProfessionTableProps {
  relationships: ReturnType<typeof getRelationshipRecordById>;
  filter: (relationships: any) => any;
  id: string;
  type: string;
}
export default function RecordRelationshipTable({
  relationships,
  filter,
  id,
  type,
}: RecordProfessionTableProps) {
  const { data } = React.use(relationships);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();
  const { table } = useDataTable({
    pageCount: 1,
    data: filter(data) || [],
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
              name="mối quan hệ"
              form={CreateRelationshipForm}
              description="mối quan hệ"
              data={{
                recordId: id,
                type,
              }}
            />
          }
          deleteDialog={
            <DeleteRelationshipsDialog
              name="mối quan hệ"
              relationships={table
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
