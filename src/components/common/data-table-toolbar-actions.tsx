'use client';

import type { Table } from '@tanstack/react-table';
import { Download } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { exportTableToCSV } from '@/lib/export';

interface DataTableToolbarActionsProps<T> {
  table: Table<T>;
  fileNameExport?: string;
  createDialog?: React.ReactNode;
  deleteDialog?: React.ReactNode;
  customDialog?: React.ReactNode[];
}
export function DataTableToolbarActions<T>({
  table,
  fileNameExport,
  deleteDialog,
  createDialog,
  customDialog,
}: DataTableToolbarActionsProps<T>) {
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0
        ? deleteDialog || null
        : null}
      {createDialog || null}
      {table.getFilteredSelectedRowModel().rows.length > 0 && customDialog
        ? customDialog.map((dialog, index) => (
            <React.Fragment key={index}>{dialog}</React.Fragment>
          ))
        : null}
      {fileNameExport && (
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
      )}
    </div>
  );
}
