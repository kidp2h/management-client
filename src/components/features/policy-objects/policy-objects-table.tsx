'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getPolicyObjects } from '@/db/queries/policy-objects';
import type { PolicyObjects } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreatePolicyObjectForm from './create-policy-object-form';
import { DeletePolicyObjectsDialog } from './delete-policy-objects-dialog';
import { getColumns } from './policy-objects-table-column';

interface PolicyObjectsTableProps {
  policyObjects: ReturnType<typeof getPolicyObjects>;
}
export const PolicyObjectsTable = ({
  policyObjects,
}: PolicyObjectsTableProps) => {
  const { data, pageCount } = use(policyObjects);
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
        <DataTableToolbarActions<PolicyObjects>
          table={table}
          fileNameExport="policyObjects"
          createDialog={
            <CreateDataDialog
              form={CreatePolicyObjectForm}
              name="Quân hàm"
              description="Tạo mới quân hàm"
            />
          }
          deleteDialog={
            <DeletePolicyObjectsDialog
              name="quân hàm"
              policyObjects={table
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
