import React from 'react';
import { getColumns } from './record-profession-table-column';
import { useTable } from '@/providers/table-provider';
import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { getProfessionsRecordById } from '@/db/queries/records';
import { CreateDataDialog } from '@/components/common/create-data-dialog';
import CreateProfessionForm from './create-profession-form';
import { DeleteProfessionsDialog } from './delete-professions-dialog';

export interface RecordProfessionTableProps {
  professions: ReturnType<typeof getProfessionsRecordById>;
  id: string;
}
export default function RecordProfessionTable({
  professions,
  id,
}: RecordProfessionTableProps) {
  const { data } = React.use(professions);
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
              name="quá trình bồi dưỡng nghiệp vụ"
              form={CreateProfessionForm}
              description="Tạo quá trình bồi dưỡng nghiệp vụ mới"
              data={{
                recordId: id,
              }}
            />
          }
          deleteDialog={
            <DeleteProfessionsDialog
              name="quá trình bồi dưỡng nghiệp vụ"
              professions={table
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
