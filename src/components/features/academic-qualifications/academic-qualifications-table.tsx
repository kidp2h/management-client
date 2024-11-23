'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getAcademicQualifications } from '@/db/queries/academic-qualifications';
import type { AcademicQualifications } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreateAcademicQualificationForm from './create-academic-qualification-form';
import { DeleteAcademicQualificationsDialog } from './delete-academic-qualifications-dialog';
import { getColumns } from './academic-qualifications-table-column';

interface AcademicQualificationsTableProps {
  academicQualifications: ReturnType<typeof getAcademicQualifications>;
}
export const AcademicQualificationsTable = ({
  academicQualifications,
}: AcademicQualificationsTableProps) => {
  const { data, pageCount } = use(academicQualifications);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Học hàm',
      value: 'name',
      placeholder: 'Tìm kiếm theo học hàm',
    },
    {
      label: 'Mã gia đình xuất thân',
      value: 'code',
      placeholder: 'Tìm kiếm theo mã gia đình xuất thân',
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
        <DataTableToolbarActions<AcademicQualifications>
          table={table}
          fileNameExport="academicQualifications"
          createDialog={
            <CreateDataDialog
              form={CreateAcademicQualificationForm}
              name="Học hàm"
              description="Tạo mới gia đình xuất thân"
            />
          }
          deleteDialog={
            <DeleteAcademicQualificationsDialog
              name="gia đình xuất thân"
              academicQualifications={table
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
