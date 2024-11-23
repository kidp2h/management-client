import React, { use } from 'react';

import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getRecordCommendationsById } from '@/db/queries/commendations';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';
import { getColumns } from '@/components/features/record/commendation/record-commendation-table-column';
import { CreateDataDialog } from '@/components/common/create-data-dialog';
import CreateCommendationForm from './create-commendation-form';
import { getRecordById } from '@/db/queries/records';
import { getAllAppellations } from '@/db/queries/appellations';
import { DeleteCommendationsDialog } from './delete-commendations-dialog';

export interface RecordsCommendationTableProps {
  recordCommendations: ReturnType<typeof getRecordCommendationsById>;
  record: Awaited<ReturnType<typeof getRecordById>>['data'];
  appellations: ReturnType<typeof getAllAppellations>;
}
export default function RecordCommendationsTable({
  recordCommendations,
  record,
  appellations,
}: RecordsCommendationTableProps) {
  const { data } = use(recordCommendations);
  console.log(appellations);
  const columns = React.useMemo(() => getColumns(appellations), []);
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
            <DeleteCommendationsDialog
              name="khen thưởng"
              commendations={table
                .getFilteredSelectedRowModel()
                .rows.map(row => row.original)}
              onSuccess={() => table.toggleAllRowsSelected(false)}
            />
          }
          createDialog={
            record?.id ? (
              <CreateDataDialog
                name="khen thưởng"
                form={CreateCommendationForm}
                description="Tạo khen thưởng mới"
                data={{
                  recordId: record.id,
                  appellations,
                }}
              />
            ) : null
          }
        />
      </DataTableAdvancedToolbar>
    </DataTable>
  );
}
