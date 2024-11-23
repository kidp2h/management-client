'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getPartyCommittees } from '@/db/queries/party-committees';
import type { PartyCommittees } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreatePartyCommitteeForm from './create-party-committee-form';
import { DeletePartyCommitteesDialog } from './delete-party-committees-dialog';
import { getColumns } from './party-committees-table-column';

interface PartyCommitteesTableProps {
  partyCommittees: ReturnType<typeof getPartyCommittees>;
}
export const PartyCommitteesTable = ({
  partyCommittees,
}: PartyCommitteesTableProps) => {
  const { data, pageCount } = use(partyCommittees);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Tên quân hàm',
      value: 'name',
      placeholder: 'Tìm kiếm theo tên quân hàm',
    },
    {
      label: 'Mã quân hàm',
      value: 'code',
      placeholder: 'Tìm kiếm theo mã quân hàm',
    },
  ];
  // const Toolbar = featureFlags.includes('advancedFilter')
  //   ? DataTableAdvancedToolbar
  //   : DataTableToolbar;
  const { table } = useDataTable({
    data,
    columns,
    enableAdvancedFilter: featureFlags.includes('advancedFilter'),
    pageCount,
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
      <DataTableAdvancedToolbar table={table} filterFields={filterFields}>
        <DataTableToolbarActions<PartyCommittees>
          table={table}
          fileNameExport="partyCommittees"
          createDialog={
            <CreateDataDialog
              form={CreatePartyCommitteeForm}
              name="Quân hàm"
              description="Tạo mới quân hàm"
            />
          }
          deleteDialog={
            <DeletePartyCommitteesDialog
              name="quân hàm"
              partyCommittees={table
                .getFilteredSelectedRowModel()
                .rows.map(row => row.original)}
              onSuccess={() => table.toggleAllRowsSelected(false)}
            />
          }
        />
      </DataTableAdvancedToolbar>
    </DataTable>
  );
};
