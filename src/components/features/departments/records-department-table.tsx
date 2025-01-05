'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getAllRecordsDepartments } from '@/db/queries/departments';
import type { Departments } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import { getColumns } from './records-department-table-column';
import CreateRecordDepartmentForm from './create-record-department-form';
import { _getRecords } from '@/db/queries/records';

interface DepartmentsTableProps {
  allRecordsDepartments: ReturnType<typeof getAllRecordsDepartments>;
  records: ReturnType<typeof _getRecords>;
  cDepartment: Record<string, string>;
}
export const RecordsDepartmentTable = ({
  allRecordsDepartments,
  cDepartment,
  records,
}: DepartmentsTableProps) => {
  const result = use(allRecordsDepartments) || [];
  // console.log( re,result);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Tên đơn vị',
      value: 'name',
      placeholder: 'Tìm kiếm theo tên đơn vị',
    },
    {
      label: 'Mã đơn vị',
      value: 'code',
      placeholder: 'Tìm kiếm theo mã đơn vị',
    },
  ];
  // const Toolbar = featureFlags.includes('advancedFilter')
  //   ? DataTableAdvancedToolbar
  //   : DataTableToolbar;
  const { table } = useDataTable({
    data: cDepartment
      ? result?.data?.filter(i => {
          return i.department.id === cDepartment?.id;
        }) || []
      : [],
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
      <DataTableAdvancedToolbar table={table} filterFields={filterFields}>
        <DataTableToolbarActions<Departments>
          table={table}
          fileNameExport="departments-records"
          createDialog={
            <CreateDataDialog
              form={CreateRecordDepartmentForm}
              disabled={!cDepartment}
              data={{
                records,
                cDepartment,
              }}
              name="đơn vị cho cán bộ"
              description="đơn vị cho cán bộ"
            />
          }
          // deleteDialog={
          //   <DeleteDepartmentsDialog
          //     name="đơn vị"
          //     departments={table
          //       .getFilteredSelectedRowModel()
          //       .rows.map(row => row.original)}
          //     onSuccess={() => table.toggleAllRowsSelected(false)}
          //   />
          // }
        />
      </DataTableAdvancedToolbar>
    </DataTable>
  );
};
