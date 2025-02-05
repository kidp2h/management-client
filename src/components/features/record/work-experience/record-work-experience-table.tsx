'use client';
import React from 'react';
import { getColumns } from './record-work-experience-table-column';
import { useTable } from '@/providers/table-provider';
import { useDataTable } from '@/hooks/use-data-table';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { getWorkExperiencesRecordById } from '@/db/queries/records';
import { CreateDataDialog } from '@/components/common/create-data-dialog';
import CreateWorkExperienceForm from './create-work-experience-form';
import { DeleteWorkExperiencesDialog } from './delete-work-experience-dialog';
import { getAllDepartments } from '@/db/queries/departments';
import { getAllDuties } from '@/db/queries/duties';

export interface RecordWorkExperienceTableProps {
  workExperiences: ReturnType<typeof getWorkExperiencesRecordById>;
  departments: ReturnType<typeof getAllDepartments>;
  duties: ReturnType<typeof getAllDuties>;
  id: string;
}
export default function RecordWorkExperienceTable({
  workExperiences,
  departments,
  duties,
  id,
}: RecordWorkExperienceTableProps) {
  const { data } = React.use(workExperiences);
  const columns = React.useMemo(() => getColumns(departments, duties), []);
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
              name="quá trình công tác"
              form={CreateWorkExperienceForm}
              description="Tạo quá trình công tác mới"
              data={{
                recordId: id,
                departments,
                duties,
              }}
            />
          }
          deleteDialog={
            <DeleteWorkExperiencesDialog
              name="quá trình công tác"
              workExperiences={table
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
