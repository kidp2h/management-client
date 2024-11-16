import React from 'react';

import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getContractsRecordById } from '@/db/queries/records';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';

import { getColumns } from './record-contract-table-column';
import { CreateDataDialog } from '@/components/common/create-data-dialog';
import CreateContractForm from './create-contract-form';
import { DeleteContractsDialog } from './delete-contracts-dialog';

export interface RecordContractTableProps {
  contracts: ReturnType<typeof getContractsRecordById>;
  id: string;
}
export default function RecordContractTable({
  contracts,
  id,
}: RecordContractTableProps) {
  console.log(id);
  const { data } = React.use(contracts);
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
              name="Thêm hợp đồng"
              form={CreateContractForm}
              description="Tạo hợp đồng mới"
              data={{
                recordId: id,
              }}
            />
          }
          deleteDialog={
            <DeleteContractsDialog
              name="hợp đồng"
              contracts={table
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
