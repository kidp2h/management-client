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

import { DeleteFormSalaryDialog } from './delete-form-salary-dialog';
import UpdateFormSalaryForm from './update-form-salary-form';

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
        label: 'Mã',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mã" />
      ),
      cell: ({ row }) => <div className="w-full">{row.getValue('code')}</div>,
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'name',
      meta: {
        label: 'Hình thức',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Hình thức" />
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
        const [showUpdateFormSalarySheet, setShowUpdateFormSalarySheet] =
          React.useState(false);
        const [showDeleteFormSalaryDialog, setShowDeleteFormSalaryDialog] =
          React.useState(false);
        React.useEffect(() => {
          // document.body.classList.remove('pointer-events-none');
        });
        return (
          <>
            <UpdateDataSheet
              open={showUpdateFormSalarySheet}
              onOpenChange={setShowUpdateFormSalarySheet}
              data={row.original}
              form={UpdateFormSalaryForm}
              name="hình thức hưởng lương"
              fieldConfig={{
                name: {
                  inputProps: {
                    type: 'text',
                    placeholder: row.original.name,
                  },
                },
              }}
            />
            <DeleteFormSalaryDialog
              name="hình thức hưởng lương"
              open={showDeleteFormSalaryDialog}
              onOpenChange={setShowDeleteFormSalaryDialog}
              formSalary={[row.original]}
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
                  onSelect={() => setShowUpdateFormSalarySheet(true)}
                >
                  Sửa
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={() => setShowDeleteFormSalaryDialog(true)}
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
