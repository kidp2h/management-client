'use client';

import React, { use } from 'react';

import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import type { Records } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import { getColumns } from './send-table-column';
import { getAllSends } from '@/db/queries/sends';
import { getAllQualifications } from '@/db/queries/qualifications';

interface RecordsTableProps {
  cDepartment: Record<string, string>;
  sends: ReturnType<typeof getAllSends>;
  qualifications: ReturnType<typeof getAllQualifications>;
}
export const SendsTable = ({
  sends,
  cDepartment,
  qualifications,
}: RecordsTableProps) => {
  const { data } = use(sends);

  console.log(data);

  const { featureFlags } = useTable();

  // console.log('provinces', provinces);
  const columns = getColumns();

  const filterFieldsText: DataTableFilterField<any>[] = [
    // {
    //   label: 'Họ và tên',
    //   value: 'fullName',
    //   placeholder: 'Tìm kiếm theo họ và tên',
    // },
    // {
    //   label: 'Mã hồ sơ',
    //   value: 'code',
    //   placeholder: 'Tìm kiếm theo mã hồ sơ',
    // },
  ];
  const filterFieldsBox: DataTableFilterField<any>[] = [];

  const { table } = useDataTable({
    // data: data?.filter(d => d.department.id === cDepartment?.id) || [],
    data: data || [],
    columns,
    enableAdvancedFilter: featureFlags.includes('advancedFilter'),
    pageCount: 1,
    filterFields: [...filterFieldsText, ...filterFieldsBox],
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
      {/* <pre> {JSON.stringify(data, null, 2)}</pre>
          {cDepartment?.id} */}
      <DataTableToolbarActions<Records> table={table} />
      <DataTableAdvancedToolbar
        table={table}
        filterFields={filterFieldsText}
        btnView={false}
      >
        <DataTableToolbar
          table={table}
          filterFields={filterFieldsBox}
          btnView
        />
      </DataTableAdvancedToolbar>
    </DataTable>
  );
};
