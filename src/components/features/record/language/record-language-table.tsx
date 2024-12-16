import React, { use } from 'react';

import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getRecordLanguagesById } from '@/db/queries/record-languages';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';
import { getColumns } from '@/components/features/record/language/record-language-table-column';
import { CreateDataDialog } from '@/components/common/create-data-dialog';
import CreateLanguageForm from './create-language-form';
import { getRecordById } from '@/db/queries/records';
import { DeleteLanguagesDialog } from './delete-languages-dialog';
import { getAllLanguages } from '@/db/queries/languages';

export interface RecordsLanguageTableProps {
  recordLanguages: ReturnType<typeof getRecordLanguagesById>;
  record: Awaited<ReturnType<typeof getRecordById>>['data'];
  languages: ReturnType<typeof getAllLanguages>;
}
export default function RecordLanguagesTable({
  recordLanguages,
  record,
  languages,
}: RecordsLanguageTableProps) {
  const { data } = use(recordLanguages);

  const columns = React.useMemo(() => getColumns(languages), []);
  const { featureFlags } = useTable();

  const filterFields: DataTableFilterField<any>[] = [];
  const { table } = useDataTable({
    data,
    columns,
    enableAdvancedFilter: featureFlags.includes('advancedFilter'),
    pageCount: 1,
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
      <DataTableAdvancedToolbar
        table={table}
        filterFields={filterFields}
        btnView={false}
      >
        <DataTableToolbarActions
          table={table}
          deleteDialog={
            <DeleteLanguagesDialog
              name="ngoại ngữ"
              languages={table
                .getFilteredSelectedRowModel()
                .rows.map(row => row.original)}
              onSuccess={() => table.toggleAllRowsSelected(false)}
            />
          }
          createDialog={
            record?.id ? (
              <CreateDataDialog
                name="ngoại ngữ"
                form={CreateLanguageForm}
                description="Tạo ngoại ngữ mới"
                data={{
                  recordId: record.id,
                  languages,
                }}
              />
            ) : null
          }
        />
      </DataTableAdvancedToolbar>
    </DataTable>
  );
}
