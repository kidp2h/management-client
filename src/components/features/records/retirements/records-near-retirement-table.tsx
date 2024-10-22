import React from 'react';

import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import { getColumns } from './records-near-retirement-column';

export default function RecordsNearRetirementTable() {
  // const { data, pageCount } = use(recordsDiscipline);

  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [];
  const { table } = useDataTable({
    data: [],
    columns,
    enableAdvancedFilter: featureFlags.includes('advancedFilter'),
    pageCount: 0,
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
      <DataTableAdvancedToolbar
        table={table}
        filterFields={filterFields}
        btnView={false}
      >
        <DataTableToolbarActions table={table} />
      </DataTableAdvancedToolbar>
    </DataTable>
  );
}
