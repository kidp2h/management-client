'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getFormRecruitments } from '@/db/queries/form-recruitments';
import type { FormRecruitments } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreateFormRecruitmentForm from './create-form-recruitment-form';
import { DeleteFormRecruitmentsDialog } from './delete-form-recruitments-dialog';
import { getColumns } from './form-recruitments-table-column';

interface FormRecruitmentsTableProps {
  formRecruitments: ReturnType<typeof getFormRecruitments>;
}
export const FormRecruitmentsTable = ({
  formRecruitments,
}: FormRecruitmentsTableProps) => {
  const { data, pageCount } = use(formRecruitments);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Hình thức tuyển dụng',
      value: 'name',
      placeholder: 'Tìm kiếm theo tên hình thức tuyển dụng',
    },
    {
      label: 'Mã hình thức tuyển dụng',
      value: 'code',
      placeholder: 'Tìm kiếm theo mã hình thức tuyển dụng',
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
        <DataTableToolbarActions<FormRecruitments>
          table={table}
          fileNameExport="formRecruitments"
          createDialog={
            <CreateDataDialog
              form={CreateFormRecruitmentForm}
              name="Hình thức tuyển dụng"
              description="Tạo mới hình thức tuyển dụng"
            />
          }
          deleteDialog={
            <DeleteFormRecruitmentsDialog
              name="hình thức tuyển dụng"
              formRecruitments={table
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
