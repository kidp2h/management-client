'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getQualifications } from '@/db/queries/qualifications';
import type { Qualifications } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreateQualificationForm from './create-qualification-form';
import { DeleteQualificationsDialog } from './delete-qualifications-dialog';
import { getColumns } from './qualifications-table-column';

interface QualificationsTableProps {
  qualifications: ReturnType<typeof getQualifications>;
}
export const QualificationsTable = ({
  qualifications,
}: QualificationsTableProps) => {
  const { data, pageCount } = use(qualifications);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Trình độ chuyên môn',
      value: 'name',
      placeholder: 'Tìm kiếm theo  trình độ chuyên môn',
    },
    {
      label: 'Mã trình độ chuyên môn',
      value: 'code',
      placeholder: 'Tìm kiếm theo mã trình độ chuyên môn',
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
        <DataTableToolbarActions<Qualifications>
          table={table}
          fileNameExport="qualifications"
          createDialog={
            <CreateDataDialog
              form={CreateQualificationForm}
              name="Trình độ chuyên môn"
              description="Tạo mới trình độ chuyên môn"
            />
          }
          deleteDialog={
            <DeleteQualificationsDialog
              name="trình độ chuyên môn"
              qualifications={table
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
