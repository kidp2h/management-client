import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import type { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import React from 'react';

import { UpdateDataSheet } from '@/components/common/update-data-sheet';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { DeletePositionsDialog } from './delete-positions-dialog';
import UpdatePositionForm from './update-position-form';

export function getColumns(): ColumnDef<any>[] {
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5 border-none bg-card-foreground"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5 border-none bg-card-foreground"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'code',
      meta: {
        label: 'Mã vị trí việc làm',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mã vị trí việc làm" />
      ),
      cell: ({ row }) => <div className="w-full">{row.getValue('code')}</div>,
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'name',
      meta: {
        label: 'Tên vị trí việc làm',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tên vị trí việc làm" />
      ),
      cell: ({ row }) => <div className="w-full">{row.getValue('name')}</div>,
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'createdAt',
      meta: {
        label: 'Ngày tạo',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngày tạo" />
      ),
      cell: ({ cell }) => dayjs(cell.getValue() as Date).format('D-MM-YYYY'),
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        const [showUpdatePositionSheet, setShowUpdatePositionSheet] =
          React.useState(false);
        const [showDeletePositionDialog, setShowDeletePositionDialog] =
          React.useState(false);
        React.useEffect(() => {
          // document.body.classList.remove('pointer-events-none');
        });
        return (
          <>
            <UpdateDataSheet
              open={showUpdatePositionSheet}
              onOpenChange={setShowUpdatePositionSheet}
              data={row.original}
              form={UpdatePositionForm}
              name="vị trí việc làm"
              fieldConfig={{
                name: {
                  inputProps: {
                    type: 'text',
                    placeholder: row.original.name,
                  },
                },
              }}
            />
            <DeletePositionsDialog
              name="vị trí việc làm"
              open={showDeletePositionDialog}
              onOpenChange={setShowDeletePositionDialog}
              positions={[row.original]}
              showTrigger={false}
              onSuccess={() => row.toggleSelected(false)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  className="flex size-8  p-0 "
                >
                  <DotsHorizontalIcon className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onSelect={() => setShowUpdatePositionSheet(true)}
                >
                  Sửa
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={() => setShowDeletePositionDialog(true)}
                >
                  Xoá
                  {/* <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut> */}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
      size: 40,
    },
  ];
}