'use client';
import React, { Suspense, useMemo } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type {
  getAllDepartments,
  getAllRecordsDepartments,
  getDepartments,
} from '@/db/queries/departments';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { DepartmentsTable } from './departments-table';
import { _getRecords } from '@/db/queries/records';
import { Eye, Plus } from 'lucide-react';

export interface DepartmentsManagementSectionProps {
  allDepartments: ReturnType<typeof getAllDepartments>;
  allRecordsDepartments: ReturnType<typeof getAllRecordsDepartments>;
  departments: ReturnType<typeof getDepartments>;
  records: ReturnType<typeof _getRecords>;
}

export default function DepartmentsManagementSection({
  allDepartments,
  departments,
  allRecordsDepartments,
  records,
}: DepartmentsManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Đơn vị' },
  ];
  const result = React.use(allDepartments);
  const [cItem, setItem] = React.useState<any>();
  const [preItem, setPreItem] = React.useState<any>();
  const [showCreateDepartmentDialog, setShowCreateDepartmentDialog] =
    React.useState(false);
  const addOnClickHandler = items => {
    return items.map(item => {
      const newItem = {
        ...item,
        onClick: () => {
          // setItem(prevItem => (prevItem?.id === item.id ? null : item));
          // console.log(cItem?.id, item.id, cItem?.id === item.id);
        },
        actions: (
          <div
            className="flex items-center gap-2 "
            onClick={() => {
              setItem(item);
            }}
          >
            <Eye className="size-5 text-muted-foreground cursor-pointer hover:text-accent-foreground" />
            <Plus
              className="size-5 text-muted-foreground cursor-pointer hover:text-accent-foreground "
              onClick={() => {
                setItem(item);
                setShowCreateDepartmentDialog(true);
              }}
            />
          </div>
        ),
      };

      if (newItem.children && newItem.children.length > 0) {
        newItem.children = addOnClickHandler(newItem.children);
      }

      return newItem;
    });
  };
  const resultMapped = useMemo(() => {
    return addOnClickHandler(result?.data || []);
  }, [result]);

  return (
    <ContentLayout title="Đơn vị">
      <AutoBreadcrumb items={items} />
      <MainContent hasCard={false}>
        {/* <TreeView data={data} className="bg-white w-80" /> */}
        {/* <CreateDepartmentsDialog
          name="đơn vị"
          cDepartment={cItem}
          open={showCreateDepartmentDialog}
          onOpenChange={setShowCreateDepartmentDialog}
          showTrigger={false}
        />
        <div className="flex flex-col lg:flex-row gap-3 mb-20 ">
          <TreeView
            data={resultMapped || []}
            className="w-[40rem] h-fit max-h-[70vh] overflow-auto mt-14 bg-primary-foreground rounded-lg border-muted border-2 border-dashed"
          />
          <div className="w-full">
            <div className="font-bold">{cItem?.name}</div>
            <TableProvider isHidden>
              <Suspense
                fallback={
                  <DataTableSkeleton
                    columnCount={3}
                    searchableColumnCount={2}
                    filterableColumnCount={2}
                    cellWidths={['10rem']}
                    shrinkZero
                  />
                }
              >
                <RecordsDepartmentTable
                  cDepartment={cItem}
                  records={records}
                  allRecordsDepartments={allRecordsDepartments}
                />
              </Suspense>
            </TableProvider>
          </div>
        </div> */}
        <div className="my-5 font-bold">Bảng quản lý Tổ chức</div>
        <TableProvider isHidden>
          <Suspense
            fallback={
              <DataTableSkeleton
                columnCount={3}
                searchableColumnCount={2}
                filterableColumnCount={2}
                cellWidths={['10rem']}
                shrinkZero
              />
            }
          >
            <DepartmentsTable
              departments={departments}
              allDepartments={allDepartments}
            />
          </Suspense>
        </TableProvider>
      </MainContent>
    </ContentLayout>
  );
}
