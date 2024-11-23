import React, { use } from 'react';

import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getRecordDisciplinesById } from '@/db/queries/disciplines';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';
import { getColumns } from '@/components/features/record/discipline/record-discipline-table-column';
import { CreateDataDialog } from '@/components/common/create-data-dialog';
import CreateDisciplineForm from './create-discipline-form';
import { getRecordById } from '@/db/queries/records';
import { DeleteDisciplinesDialog } from './delete-disciplines-dialog';
import { getAllDepartments } from '@/db/queries/departments';
import { getAllFormDisciplines } from '@/db/queries/form-disciplines';

export interface RecordsDisciplineTableProps {
  recordDisciplines: ReturnType<typeof getRecordDisciplinesById>;
  record: Awaited<ReturnType<typeof getRecordById>>['data'];
  departments: ReturnType<typeof getAllDepartments>;
  formDisciplines: ReturnType<typeof getAllFormDisciplines>;
}
export default function RecordDisciplinesTable({
  recordDisciplines,
  record,
  departments,
  formDisciplines,
}: RecordsDisciplineTableProps) {
  const { data } = use(recordDisciplines);

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
            <DeleteDisciplinesDialog
              name="kỷ luật"
              disciplines={table
                .getFilteredSelectedRowModel()
                .rows.map(row => row.original)}
              onSuccess={() => table.toggleAllRowsSelected(false)}
            />
          }
          createDialog={
            record?.id ? (
              <CreateDataDialog
                name="kỷ luật"
                form={CreateDisciplineForm}
                description="Tạo kỷ luật mới"
                data={{
                  recordId: record.id,
                  departments,
                  formDisciplines,
                }}
              />
            ) : null
          }
        />
      </DataTableAdvancedToolbar>
    </DataTable>
  );
}
