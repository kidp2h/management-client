'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import type { getTechnologyCertifications } from '@/db/queries/technology-certifications';
import type { TechnologyCertifications } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreateTechnologyCertificationForm from './create-technology-certification-form';
import { DeleteTechnologyCertificationsDialog } from './delete-technology-certifications-dialog';
import { getColumns } from './technology-certifications-table-column';

interface TechnologyCertificationsTableProps {
  technologyCertifications: ReturnType<typeof getTechnologyCertifications>;
}
export const TechnologyCertificationsTable = ({
  technologyCertifications,
}: TechnologyCertificationsTableProps) => {
  const { data, pageCount } = use(technologyCertifications);
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
        <DataTableToolbarActions<TechnologyCertifications>
          table={table}
          fileNameExport="technologyCertifications"
          createDialog={
            <CreateDataDialog
              form={CreateTechnologyCertificationForm}
              name="Chứng chỉ"
              description="Tạo mới chứng chỉ"
            />
          }
          deleteDialog={
            <DeleteTechnologyCertificationsDialog
              name="chứng chỉ"
              technologyCertifications={table
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
