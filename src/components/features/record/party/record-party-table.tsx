import React, { use } from 'react';

import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';

import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';
import { getColumns } from '@/components/features/record/party/record-party-table-column';
import { CreateDataDialog } from '@/components/common/create-data-dialog';
import CreatePartyForm from './create-party-form';
import { getRecordById } from '@/db/queries/records';
import { DeletePartiesDialog } from './delete-parties-dialog';
import type { getRecordPartiesById } from '@/db/queries/parties';
// import { getAllFormParties } from '@/db/queries/form-parties';

export interface RecordsPartyTableProps {
  recordParties: ReturnType<typeof getRecordPartiesById>;
  record: Awaited<ReturnType<typeof getRecordById>>['data'];
}
export default function RecordPartiesTable({
  recordParties,
  record,
}: RecordsPartyTableProps) {
  const { data } = use(recordParties);

  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [];
  const { table } = useDataTable({
    data,
    columns,
    enableAdvancedFilter: featureFlags.includes('advancedFilter'),
    pageCount: 1,
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
      <DataTableAdvancedToolbar
        table={table}
        filterFields={filterFields}
        btnView={false}
      >
        <DataTableToolbarActions
          table={table}
          deleteDialog={
            <DeletePartiesDialog
              name="kỷ luật"
              parties={table
                .getFilteredSelectedRowModel()
                .rows.map(row => row.original)}
              onSuccess={() => table.toggleAllRowsSelected(false)}
            />
          }
          createDialog={
            record?.id ? (
              <CreateDataDialog
                name="kỷ luật"
                form={CreatePartyForm}
                description="Tạo kỷ luật mới"
                data={{
                  recordId: record.id,
                }}
              />
            ) : null
          }
        />
      </DataTableAdvancedToolbar>
    </DataTable>
  );
}
