'use client';

import React, { use } from 'react';

import { DataTableToolbarActions } from '@/components/common/data-table-toolbar-actions';
import { DataTableAdvancedToolbar } from '@/components/data-table/advanced/data-table-advanced-toolbar';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableToolbar } from '@/components/data-table/data-table-toolbar';
import type { getRecords } from '@/db/queries/records';
import { type Records, records } from '@/db/schema';
import { useDataTable } from '@/hooks/use-data-table';
import { useTable } from '@/providers/table-provider';
import type { DataTableFilterField } from '@/types';

import { DeleteRecordsDialog } from './delete-record-dialog';
import { getColumns } from './records-table-column';
import { getAllReligions } from '@/db/queries/religions';
import { useGlobalStore } from '@/providers/global-store-provider';
import { getAllEthnicities } from '@/db/queries/ethnicities';
import { getAllDepartments } from '@/db/queries/departments';
import { getAllQualifications } from '@/db/queries/qualifications';
import { getAllDuties } from '@/db/queries/duties';
import { getAllAppellations } from '@/db/queries/appellations';
import { getAllFormDisciplines } from '@/db/queries/form-disciplines';

interface RecordsTableProps {
  records: ReturnType<typeof getRecords>;
  religions: ReturnType<typeof getAllReligions>;
  cDepartment: Record<string, string>;
  ethnicities: ReturnType<typeof getAllEthnicities>;
  departments: ReturnType<typeof getAllDepartments>;
  qualifications: ReturnType<typeof getAllQualifications>;
  duties: ReturnType<typeof getAllDuties>;
  appellations: ReturnType<typeof getAllAppellations>;
  formDisciplines: ReturnType<typeof getAllFormDisciplines>;
}
export const RecordsTable = ({
  records: _records,
  cDepartment,
  religions,
  ethnicities,
  qualifications,
  departments,
  duties,
  appellations,
  formDisciplines,
}: RecordsTableProps) => {
  const { data, pageCount } = use(_records);
  const { data: dataReligions } = use(religions);
  const { data: dataEthnicities } = use(ethnicities);
  // console.log(data);

  const { featureFlags } = useTable();
  const { provinces } = useGlobalStore(state => state);
  // console.log('provinces', provinces);
  const columns = React.useMemo(
    () =>
      getColumns(
        religions,
        provinces,
        ethnicities,
        qualifications,
        departments,
        duties,
        appellations,
        formDisciplines,
        cDepartment,
      ),
    [cDepartment],
  );
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
      label: 'Tôn giáo',
      value: 'religion',

      options: dataReligions?.map(rel => ({
        label: rel.name,
        value: rel.id,

        withCount: false,
      })),
    },
    {
      label: 'Dân tộc',
      value: 'ethnicity',

      options: dataEthnicities?.map(e => ({
        label: e.name,
        value: e.id,

        withCount: false,
      })),
    },
    {
      label: 'Giới tính',
      value: 'gender',

      options: ['Nam', 'Nữ']?.map(g => ({
        label: g,
        value: g,

        withCount: false,
      })),
    },
    {
      label: 'Nơi sinh',
      value: 'birthPlace',

      options: provinces.map(g => ({
        label: g.name,
        value: g.name,

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
    data: cDepartment
      ? data?.filter(i => {
          return i.department.id === cDepartment?.id;
        }) || []
      : [],
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
        // createDialog={
        //   <CreateDataDialog
        //     form={CreateRecordForm}
        //     name="Hồ sơ"
        //     description="Tạo mới hồ sơ"
        //   />
        // }
        deleteDialog={
          <DeleteRecordsDialog
            cDepartment={cDepartment}
            name="hồ sơ"
            records={table
              .getFilteredSelectedRowModel()
              .rows.map(row => row.original.record)}
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
