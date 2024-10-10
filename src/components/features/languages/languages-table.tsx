'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getLanguages } from '@/db/queries/languages';
import type { Languages } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreateLanguageForm from './create-language-form';
import { DeleteLanguagesDialog } from './delete-language-dialog';
import { getColumns } from './languages-table-column';

interface LanguagesTableProps {
  languages: ReturnType<typeof getLanguages>;
}
export const LanguagesTable = ({ languages }: LanguagesTableProps) => {
  const { data, pageCount } = use(languages);
  const columns = React.useMemo(() => getColumns(), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [
    {
      label: 'Tên ngôn ngữ',
      value: 'name',
      placeholder: 'Tìm kiếm theo tên ngôn ngữ',
    },
    {
      label: 'Mã ngôn ngữ',
      value: 'code',
      placeholder: 'Tìm kiếm theo mã ngôn ngữ',
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
        <DataTableToolbarActions<Languages>
          table={table}
          fileNameExport="languages"
          createDialog={
            <CreateDataDialog
              form={CreateLanguageForm}
              name="ngôn ngữ"
              description="Tạo mới ngôn ngữ"
            />
          }
          deleteDialog={
            <DeleteLanguagesDialog
              name="ngôn ngữ"
              languages={table
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
