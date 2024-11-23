import type { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import dayjs from 'dayjs';
import { UpdateDataSheet } from '@/components/common/update-data-sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import React from 'react';
import { DeleteOldRegimesDialog } from './delete-old-regimes-dialog';
import UpdateOldRegimeForm from './update-old-regime-form';

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
      accessorKey: 'from',
      meta: {
        label: 'Ngày bắt đầu',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngày bắt đầu" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">
          {dayjs(cell.getValue() as Date).format('DD-MM-YYYY')}
        </div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'to',
      meta: {
        label: 'Ngày kết thúc',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngày kết thúc" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">
          {dayjs(cell.getValue() as Date).format('DD-MM-YYYY')}
        </div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'department',
      meta: {
        label: 'Cơ quan/Đơn vị',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cơ quan/Đơn vị" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'address',
      meta: {
        label: 'Địa điểm',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Địa điểm" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'duty',
      meta: {
        label: 'Chức vụ',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Chức vụ" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        const [showUpdateOldRegimeSheet, setShowUpdateOldRegimeSheet] =
          React.useState(false);
        const [showDeleteOldRegimeDialog, setShowDeleteOldRegimeDialog] =
          React.useState(false);
        React.useEffect(() => {
          // document.body.classList.remove('pointer-events-none');
        });
        return (
          <>
            <UpdateDataSheet
              open={showUpdateOldRegimeSheet}
              onOpenChange={setShowUpdateOldRegimeSheet}
              data={row.original}
              form={UpdateOldRegimeForm}
              name="chế độ cũ"
              fieldConfig={{
                from: {
                  inputProps: {
                    placeholder: dayjs(row.original.from).format('DD-MM-YYYY'),
                  },
                },
                to: {
                  inputProps: {
                    placeholder: dayjs(row.original.to).format('DD-MM-YYYY'),
                  },
                },
              }}
            />
            <DeleteOldRegimesDialog
              name="chế độ cũ"
              open={showDeleteOldRegimeDialog}
              onOpenChange={setShowDeleteOldRegimeDialog}
              oldRegimes={[row.original]}
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
                  onSelect={() => setShowUpdateOldRegimeSheet(true)}
                >
                  Sửa
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={() => setShowDeleteOldRegimeDialog(true)}
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