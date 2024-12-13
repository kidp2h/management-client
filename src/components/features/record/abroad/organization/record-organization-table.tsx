import React from 'react';

import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getOrganizationsRecordById } from '@/db/queries/records';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';

import { getColumns } from './record-organization-table-column';
import { CreateDataDialog } from '@/components/common/create-data-dialog';
import CreateOrganizationForm from './create-organization-form';
import { DeleteOrganizationsDialog } from './delete-organization-dialog';

export interface RecordOrganizationTableProps {
  organizations: ReturnType<typeof getOrganizationsRecordById>;
  id: string;
}
export default function RecordOrganizationTable({
  organizations,
  id,
}: RecordOrganizationTableProps) {
  // console.log(id);
  const { data } = React.use(organizations);
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
              name="tổ chức nước ngoài"
              form={CreateOrganizationForm}
              description="Tạo tổ chức nước ngoài"
              data={{
                recordId: id,
              }}
            />
          }
          deleteDialog={
            <DeleteOrganizationsDialog
              name="tổ chức nước ngoài"
              organizations={table
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
