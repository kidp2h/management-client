import React, { use } from 'react';

import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getRecordsRetired } from '@/db/queries/records';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import { getColumns } from './records-retired-column';

export interface RecordsNearRetirementTableProps {
  recordsRetired: ReturnType<typeof getRecordsRetired>;
  cDepartment: any;
}
export default function RecordsRetiredTable({
  recordsRetired,
  cDepartment,
}: RecordsNearRetirementTableProps) {
  const { data, pageCount } = use(recordsRetired);

  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFieldsText: DataTableFilterField<any>[] = [];
  const { table } = useDataTable({
    data: data.filter(r => r?.department?.id === cDepartment?.id),
    columns,
    enableAdvancedFilter: featureFlags.includes('advancedFilter'),
    pageCount,
    filterFields: filterFieldsText,
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
        filterFields={filterFieldsText}
        btnView={false}
      >
        <DataTableToolbarActions table={table} />
      </DataTableAdvancedToolbar>
    </DataTable>
  );
}
