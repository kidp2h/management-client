'use client';

import React, { use } from 'react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import type { getRecords } from '@/db/queries/records';
import { enumReligions, type Ranks, type Records, records } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import CreateRecordForm from './create-record-form';
import { DeleteRecordsDialog } from './delete-record-dialog';
import { getColumns } from './records-table-column';

interface RecordsTableProps {
  records: ReturnType<typeof getRecords>;
  ranks: Ranks[];
}
export const RecordsTable = ({
  records: _records,
  ranks,
}: RecordsTableProps) => {
  const { data, pageCount } = use(_records);
  const columns = React.useMemo(() => getColumns({ ranks }), []);
  const { featureFlags } = useTable();
  const filterFieldsText: DataTableFilterField<any>[] = [
    {
      label: 'Họ và tên',
      value: 'fullName',
      placeholder: 'Tìm kiếm theo họ và tên',
    },
    {
      label: 'Mã hồ sơ',
      value: 'code',
      placeholder: 'Tìm kiếm theo mã hồ sơ',
    },
  ];
  const filterFieldsBox: DataTableFilterField<any>[] = [
    {
      label: 'Nhóm máu',
      value: 'bloodType',
      options: records.bloodType.enumValues.map(type => ({
        label: type[0]?.toUpperCase() + type.slice(1),
        value: type,
        withCount: false,
      })),
    },
    {
      label: 'Tiếng Anh',
      value: 'englishCertification',
      options: records.englishCertification.enumValues.map(type => ({
        label: type[0]?.toUpperCase() + type.slice(1),
        value: type,
        withCount: false,
      })),
    },
    {
      label: 'Tin học',
      value: 'technologyCertification',
      options: records.technologyCertification.enumValues.map(type => ({
        label: type[0]?.toUpperCase() + type.slice(1),
        value: type,
        withCount: false,
      })),
    },
    {
      label: 'Tôn giáo',
      value: 'religion',

      options: enumReligions.map(rel => ({
        label: rel,
        value: rel,

        withCount: false,
      })),
    },
    {
      label: 'Trình độ',
      value: 'rank',

      options: ranks.map(r => ({
        label: r.name,
        value: r.id,

        withCount: false,
      })),
    },
    {
      label: 'Đảng viên',
      value: 'isPartyMember',

      options: [true, false].map(r => ({
        label: r ? 'Có' : 'Không',
        value: r.toString(),
        isBoolean: true,

        withCount: false,
      })),
    },
    {
      label: 'Ngày sinh',
      value: 'birthday',
      isDate: true,
    },
  ];

  const { table } = useDataTable({
    data,
    columns,
    enableAdvancedFilter: featureFlags.includes('advancedFilter'),
    pageCount,
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
      <DataTableToolbarActions<Records>
        table={table}
        fileNameExport="records"
        createDialog={
          <CreateDataDialog
            form={CreateRecordForm}
            name="Hồ sơ"
            description="Tạo mới hồ sơ"
          />
        }
        deleteDialog={
          <DeleteRecordsDialog
            name="hồ sơ"
            records={table
              .getFilteredSelectedRowModel()
              .rows.map(row => row.original)}
            onSuccess={() => table.toggleAllRowsSelected(false)}
          />
        }
      />
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
