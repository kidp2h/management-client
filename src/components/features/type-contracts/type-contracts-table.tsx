'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getTypeContracts } from '@/db/queries/type-contracts';
import type { TypeContracts } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreateTypeContractForm from './create-type-contract-form';
import { DeleteTypeContractsDialog } from './delete-type-contracts-dialog';
import { getColumns } from './type-contracts-table-column';

interface TypeContractsTableProps {
  typeContracts: ReturnType<typeof getTypeContracts>;
}
export const TypeContractsTable = ({
  typeContracts,
}: TypeContractsTableProps) => {
  const { data, pageCount } = use(typeContracts);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Loại hợp đồng',
      value: 'name',
      placeholder: 'Tìm kiếm theo tên loại hợp đồng',
    },
    {
      label: 'Mã loại hợp đồng',
      value: 'code',
      placeholder: 'Tìm kiếm theo mã loại hợp đồng',
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
        <DataTableToolbarActions<TypeContracts>
          table={table}
          fileNameExport="typeContracts"
          createDialog={
            <CreateDataDialog
              form={CreateTypeContractForm}
              name="Loại hợp đồng"
              description="Tạo mới loại hợp đồng"
            />
          }
          deleteDialog={
            <DeleteTypeContractsDialog
              name="loại hợp đồng"
              typeContracts={table
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
