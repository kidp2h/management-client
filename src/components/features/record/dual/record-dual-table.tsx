import React, { use } from 'react';

import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getRecordDualsById } from '@/db/queries/duals';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';
import { getColumns } from '@/components/features/record/dual/record-dual-table-column';
import { CreateDataDialog } from '@/components/common/create-data-dialog';
import CreateDualForm from './create-dual-form';
import { getRecordById } from '@/db/queries/records';
import { DeleteDualsDialog } from './delete-duals-dialog';
import { getDepartmentsByRecord } from '@/db/queries/departments';
import { getAllDuties } from '@/db/queries/duties';

export interface RecordsDualTableProps {
  recordDuals: ReturnType<typeof getRecordDualsById>;
  record?: Awaited<ReturnType<typeof getRecordById>>['data'];
  departmentsOfRecord?: ReturnType<typeof getDepartmentsByRecord>;
  duties: ReturnType<typeof getAllDuties>;
  cDepartment?: any;
}
export default function RecordDualsTable({
  recordDuals,
  record,
  departmentsOfRecord,
  duties,
  cDepartment,
}: RecordsDualTableProps) {
  const { data } = use(recordDuals);

  const columns = React.useMemo(() => getColumns(departmentsOfRecord), []);
  const { featureFlags } = useTable();
  const dataFilter = cDepartment
    ? data.filter(d => d?.department?.id === cDepartment?.id)
    : data;
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
            <DeleteDualsDialog
              name="quá trình kiêm nhiệm"
              duals={table
                .getFilteredSelectedRowModel()
                .rows.map(row => row.original)}
              onSuccess={() => table.toggleAllRowsSelected(false)}
            />
          }
          createDialog={
            record?.id ? (
              <CreateDataDialog
                name="quá trình kiêm nhiệm"
                form={CreateDualForm}
                description="Tạo quá trình kiêm nhiệm mới"
                data={{
                  recordId: record.id,
                  departmentsOfRecord,
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
