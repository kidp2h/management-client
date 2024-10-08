'use client';

import type { Table } from '@tanstack/react-table';
import { Download } from 'lucide-react';

import { CreateDataDialog } from '@/components/common/create-data-dialog';
import { Button } from '@/components/ui/button';
import type { Religions } from '@/db/schema';
import { exportTableToCSV } from '@/lib/export';

import CreateReligionForm from './create-religion-form';
import { DeleteReligionsDialog } from './delete-religion-dialog';

interface ReligionsTableToolbarActionsProps {
  table: Table<Religions>;
}

export function ReligionsTableToolbarActions({
  table,
}: ReligionsTableToolbarActionsProps) {
  const deleteDialog = (
    <DeleteReligionsDialog
      name="tôn giáo"
      religions={table
        .getFilteredSelectedRowModel()
        .rows.map(row => row.original)}
      onSuccess={() => table.toggleAllRowsSelected(false)}
    />
  );
  return (
    <div className="flex items-center gap-2">
      {table.getFilteredSelectedRowModel().rows.length > 0
        ? deleteDialog
        : null}
      <CreateDataDialog
        form={CreateReligionForm}
        name="Tôn giáo"
        description=""
      />
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          exportTableToCSV(table, {
            filename: 'religions',
            excludeColumns: ['select', 'actions'],
          })
        }
      >
        <Download className="mr-2 size-4" aria-hidden="true" />
        Xuất tệp Excel
      </Button>
      {/**
        * Other actions can be added here.
        * For example, import, view, etc.
        */}
    </div>
  );
}
