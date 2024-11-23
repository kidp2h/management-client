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

import { DeleteSalariesDialog } from './delete-salaries-dialog';
import UpdateSalaryForm from './update-salary-form';
import { getAllSalaryGrades } from '@/db/queries/salary-grades';

export function getColumns(
  grades: ReturnType<typeof getAllSalaryGrades>,
): ColumnDef<any>[] {
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
    // {
    //   accessorKey: 'code',
    //   meta: {
    //     label: 'Mã',
    //   },
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Mã" />
    //   ),
    //   cell: ({ row }) => <div className="w-full">{row.getValue('code')}</div>,
    //   enableSorting: false,
    //   enableHiding: true,
    // },
    {
      accessorKey: 'type',
      meta: {
        label: 'Nhóm ngạch',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nhóm ngạch" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'rank',
      meta: {
        label: 'Bậc',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Bậc" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'factor',
      meta: {
        label: 'Hệ số',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Hệ số" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'salary',
      meta: {
        label: 'Mức lương (nghìn đồng)',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mức lương (nghìn đồng)" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
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
        const [showUpdateSalarySheet, setShowUpdateSalarySheet] =
          React.useState(false);
        const [showDeleteSalaryDialog, setShowDeleteSalaryDialog] =
          React.useState(false);
        const { data } = React.use(grades);
        React.useEffect(() => {
          // document.body.classList.remove('pointer-events-none');
        });
        return (
          <>
            <UpdateDataSheet
              open={showUpdateSalarySheet}
              onOpenChange={setShowUpdateSalarySheet}
              data={row.original}
              form={UpdateSalaryForm}
              name="lương"
              dataset={{ grades: data }}
              fieldConfig={{
                type: {
                  inputProps: {
                    type: 'text',
                    placeholder: row.original.type,
                  },
                },
                rank: {
                  inputProps: {
                    type: 'text',
                    placeholder: row.original.rank,
                  },
                },
                factor: {
                  inputProps: {
                    type: 'text',
                    placeholder: row.original.factor,
                  },
                },
                salary: {
                  inputProps: {
                    type: 'text',
                    placeholder: row.original.salary,
                  },
                },
              }}
            />
            <DeleteSalariesDialog
              name="lương"
              open={showDeleteSalaryDialog}
              onOpenChange={setShowDeleteSalaryDialog}
              salaries={[row.original]}
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
                  onSelect={() => setShowUpdateSalarySheet(true)}
                >
                  Sửa
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={() => setShowDeleteSalaryDialog(true)}
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
