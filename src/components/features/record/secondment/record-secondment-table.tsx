import React, { use } from 'react';

import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getRecordSecondmentsById } from '@/db/queries/secondments';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';
import { getColumns } from '@/components/features/record/secondment/record-secondment-table-column';
import { CreateDataDialog } from '@/components/common/create-data-dialog';
import CreateSecondmentForm from './create-secondment-form';
import { getRecordById } from '@/db/queries/records';
import { DeleteSecondmentsDialog } from './delete-secondments-dialog';
import { getAllDepartments } from '@/db/queries/departments';
import { getAllDuties } from '@/db/queries/duties';

export interface RecordsSecondmentTableProps {
  recordSecondments: ReturnType<typeof getRecordSecondmentsById>;
  record?: Awaited<ReturnType<typeof getRecordById>>['data'];
  departments: ReturnType<typeof getAllDepartments>;
  duties: ReturnType<typeof getAllDuties>;
  cDepartment?: any;
}
export default function RecordSecondmentsTable({
  recordSecondments,
  record,
  departments,
  duties,
  cDepartment,
}: RecordsSecondmentTableProps) {
  const { data } = use(recordSecondments);
  const dataFilter = cDepartment
    ? data.filter(d => d?.department?.id === cDepartment?.id)
    : data;
  const columns = React.useMemo(() => getColumns(departments), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [];
  const { table } = useDataTable({
    data: dataFilter,
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
    <DataTable table={table} pagination={false}>
      <DataTableAdvancedToolbar
        table={table}
        filterFields={filterFields}
        btnView={false}
      >
        <DataTableToolbarActions
          table={table}
          deleteDialog={
            <DeleteSecondmentsDialog
              name="quá trình biệt phái"
              secondments={table
                .getFilteredSelectedRowModel()
                .rows.map(row => row.original)}
              onSuccess={() => table.toggleAllRowsSelected(false)}
            />
          }
          createDialog={
            record?.id ? (
              <CreateDataDialog
                name="quá trình biệt phái"
                form={CreateSecondmentForm}
                description="Tạo quá trình kiêm nhiệm mới"
                data={{
                  recordId: record.id,
                  departments,
                  duties,
                }}
              />
            ) : null
          }
        />
      </DataTableAdvancedToolbar>
    </DataTable>
  );
}
