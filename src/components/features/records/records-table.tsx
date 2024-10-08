'use client';

import React, { use } from 'react';

import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import { getColumns } from './records-table-column';

interface RecordsTableProps {
  records: Promise<any>;
}
export const RecordsTable = ({ records }: RecordsTableProps) => {
  const { data, pageCount }: any = use(records);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Mã hồ sơ',
      value: 'code',
      placeholder: 'Tìm kiếm theo mã hồ sơ',
    },
  ];
  const Toolbar = featureFlags.includes('advancedFilter')
    ? DataTableAdvancedToolbar
    : DataTableToolbar;
  const { table } = useDataTable({
    data,
    columns,
    enableAdvancedFilter: featureFlags.includes('advancedFilter'),
    pageCount,
    filterFields,
    getRowId: (originalRow, index) => `${originalRow.id}-${index}`,
    shallow: false,
    clearOnDefault: true,
  });
  return (
    <DataTable table={table}>
      <Toolbar table={table} filterFields={filterFields} />
    </DataTable>
  );
};
