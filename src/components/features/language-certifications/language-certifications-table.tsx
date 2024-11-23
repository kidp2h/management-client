'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getLanguageCertifications } from '@/db/queries/language-certifications';
import type { LanguageCertifications } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreateLanguageCertificationForm from './create-language-certification-form';
import { DeleteLanguageCertificationsDialog } from './delete-language-certifications-dialog';
import { getColumns } from './language-certifications-table-column';

interface LanguageCertificationsTableProps {
  languageCertifications: ReturnType<typeof getLanguageCertifications>;
}
export const LanguageCertificationsTable = ({
  languageCertifications,
}: LanguageCertificationsTableProps) => {
  const { data, pageCount } = use(languageCertifications);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Tên chứng chỉ',
      value: 'name',
      placeholder: 'Tìm kiếm theo tên chứng chỉ',
    },
    {
      label: 'Mã chứng chỉ',
      value: 'code',
      placeholder: 'Tìm kiếm theo mã chứng chỉ',
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
        <DataTableToolbarActions<LanguageCertifications>
          table={table}
          fileNameExport="languageCertifications"
          createDialog={
            <CreateDataDialog
              form={CreateLanguageCertificationForm}
              name="Chứng chỉ"
              description="Tạo mới chứng chỉ"
            />
          }
          deleteDialog={
            <DeleteLanguageCertificationsDialog
              name="chứng chỉ"
              languageCertifications={table
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
