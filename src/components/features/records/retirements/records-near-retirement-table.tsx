import dayjs from 'dayjs';
import React, { use } from 'react';

import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getRecordsRetirement } from '@/db/queries/records';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import { ListRecordsRetireDialog } from './list-records-retire-dialog';
import { getColumns } from './records-near-retirement-column';

export interface RecordsNearRetirementTableProps {
  records: ReturnType<typeof getRecordsRetirement>;
  cDepartment: any;
}
export default function RecordsNearRetirementTable({
  records,
  cDepartment,
}: RecordsNearRetirementTableProps) {
  const { data } = use(records);
  // console.log(data);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [];
  const { table } = useDataTable({
    data: data
      .filter(record => record?.department?.id === cDepartment?.id)
      .filter(record => {
        const birthday = dayjs(record.birthday);
        const retirementAge = record.gender === 'male' ? 60 : 59;
        const retirementDate = birthday.add(retirementAge, 'year');
        const yearsToRetirement = retirementDate.diff(dayjs(), 'year', true);

        // Consider records that are within 1 year of retirement
        // console.log(yearsToRetirement);
        return yearsToRetirement <= 1;
      }),
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
    <DataTable table={table} pagination={false}>
      <DataTableAdvancedToolbar
        table={table}
        filterFields={filterFields}
        btnView={false}
      >
        <DataTableToolbarActions
          table={table}
          customDialog={[
            <ListRecordsRetireDialog
              key="list-records-retire-dialog"
              records={table
                .getFilteredSelectedRowModel()
                .rows.map(row => row.original)}
              onSuccess={() => table.toggleAllRowsSelected(false)}
            />,
          ]}
        />
      </DataTableAdvancedToolbar>
    </DataTable>
  );
}
