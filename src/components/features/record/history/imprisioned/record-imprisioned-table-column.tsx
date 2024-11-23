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
import { DeleteImprisionedsDialog } from './delete-imprisioned-dialog';
import UpdateImprisionedForm from './update-imprisioned-form';

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
      accessorKey: 'at',
      meta: {
        label: 'Tại',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tại" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'providedTo',
      meta: {
        label: 'Đã khai báo cho ai',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Đã khai báo cho ai" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'problems',
      meta: {
        label: 'Những vấn đề gì',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Những vấn đề gì" />
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
        const [showUpdateImprisionedSheet, setShowUpdateImprisionedSheet] =
          React.useState(false);
        const [showDeleteImprisionedDialog, setShowDeleteImprisionedDialog] =
          React.useState(false);
        React.useEffect(() => {
          // document.body.classList.remove('pointer-events-none');
        });
        return (
          <>
            <UpdateDataSheet
              open={showUpdateImprisionedSheet}
              onOpenChange={setShowUpdateImprisionedSheet}
              data={row.original}
              form={UpdateImprisionedForm}
              name="lịch sử cá nhân"
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
                imprisionedType: {
                  inputProps: {
                    placeholder: row.original.imprisionedType,
                    defaultValue: row.original.imprisionedType,
                    value: row.original.imprisionedType,
                  },
                },
                decisionNumber: {
                  inputProps: {
                    placeholder: row.original.decisionNumber,
                    value: row.original.decisionNumber,
                    defaultValue: row.original.decisionNumber,
                  },
                },
                recruimentType: {
                  inputProps: {
                    placeholder: row.original.recruimentType,
                    value: row.original.recruimentType,
                    defaultValue: row.original.recruimentType,
                  },
                },
                dateRecruiment: {
                  inputProps: {
                    placeholder: dayjs(row.original.dateRecruiment).format(
                      'DD-MM-YYYY',
                    ),
                  },
                },
              }}
            />
            <DeleteImprisionedsDialog
              name="lịch sử cá nhân"
              open={showDeleteImprisionedDialog}
              onOpenChange={setShowDeleteImprisionedDialog}
              imprisioneds={[row.original]}
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
                  onSelect={() => setShowUpdateImprisionedSheet(true)}
                >
                  Sửa
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={() => setShowDeleteImprisionedDialog(true)}
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
