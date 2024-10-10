'use client';

import type { Table } from '@tanstack/react-table';
import { Download } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { exportTableToCSV } from '@/lib/export';

interface DataTableToolbarActionsProps<T> {
  table: Table<T>;
  fileNameExport: string;
  createDialog: React.ReactNode;
  deleteDialog: React.ReactNode;
}
export function DataTableToolbarActions<T>({
  table,
  fileNameExport,
  deleteDialog,
  createDialog,
}: DataTableToolbarActionsProps<T>) {
  // const deleteDialog = (
  //   <DeleteReligionsDialog
  //     name={name}
  //     religions={table
  //       .getFilteredSelectedRowModel()
  //       .rows.map(row => row.original)}
  //     onSuccess={() => table.toggleAllRowsSelected(false)}
  //   />
  // );
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0
        ? deleteDialog
        : null}
      {/* {<CreateDataDialog
        form={CreateReligionForm}
        name={name}
        description={`Tạo mới ${name}`}
      />} */}
      {createDialog}
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: fileNameExport,
            excludeColumns: ['select', 'actions'],
          })
        }
      >
        <Download className="mr-2 size-4" aria-hidden="true" />
        Xuất tệp Excel
      </Button>
    </div>
  );
}
