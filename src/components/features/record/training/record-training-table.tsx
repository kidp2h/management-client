'use client';
import React from 'react';
import { getColumns } from './record-training-table-column';
import { useTable } from '@/providers/table-provider';
import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { getTrainingsRecordById } from '@/db/queries/records';
import { CreateDataDialog } from '@/components/common/create-data-dialog';
import CreateTrainingForm from './create-training-form';
import { DeleteTrainingsDialog } from './delete-trainings-dialog';
import { getAllFormTrainings } from '@/db/queries/form-trainings';
import { getAllQualifications } from '@/db/queries/qualifications';

export interface RecordTrainingTableProps {
  trainings: ReturnType<typeof getTrainingsRecordById>;
  id: string;
  formTrainings: ReturnType<typeof getAllFormTrainings>;
  qualifications: ReturnType<typeof getAllQualifications>;
}
export default function RecordTrainingTable({
  trainings,
  formTrainings,
  qualifications,
  id,
}: RecordTrainingTableProps) {
  const { data } = React.use(trainings);
  const columns = React.useMemo(
    () => getColumns(qualifications, formTrainings),
    [],
  );
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
              name="quá trình đào tạo chuyên môn"
              form={CreateTrainingForm}
              description="Tạo quá trình đào tạo chuyên môn mới"
              data={{
                recordId: id,
                formTrainings,
                qualifications,
              }}
            />
          }
          deleteDialog={
            <DeleteTrainingsDialog
              name="quá trình đạo tào chuyên môn"
              trainings={table
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
