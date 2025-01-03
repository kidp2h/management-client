import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import type { ColumnDef } from '@tanstack/react-table';
import React from 'react';

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { DeleteRecordsDepartmentDialog } from './delete-records-department-dialog';

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
      accessorKey: 'record.fullName',
      meta: {
        label: 'Họ và tên',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Họ và tên" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'department.name',
      meta: {
        label: 'Ban',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ban" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    // {
    //   accessorKey: 'name',
    //   meta: {
    //     label: 'Tên đơn vị',
    //   },
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Tên" />
    //   ),
    //   cell: ({ row }) => <div className="w-full">{row.getValue('name')}</div>,
    //   enableSorting: false,
    //   enableHiding: true,
    // },
    // {
    //   accessorKey: 'createdAt',
    //   meta: {
    //     label: 'Ngày tạo',
    //   },
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Ngày tạo" />
    //   ),
    //   cell: ({ cell }) => dayjs(cell.getValue() as Date).format('D-MM-YYYY'),
    // },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        const [showUpdateDepartmentSheet, setShowUpdateDepartmentSheet] =
          React.useState(false);
        const [showDeleteDepartmentDialog, setShowDeleteDepartmentDialog] =
          React.useState(false);
        React.useEffect(() => {
          // document.body.classList.remove('pointer-events-none');
        });
        return (
          <>
            <DeleteRecordsDepartmentDialog
              name="thành viên đơn vị, tổ chức"
              open={showDeleteDepartmentDialog}
              onOpenChange={setShowDeleteDepartmentDialog}
              recordsDepartment={[row.original]}
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
                {/* <DropdownMenuItem
                  onSelect={() => setShowUpdateDepartmentSheet(true)}
                >
                  Sửa
                </DropdownMenuItem> */}

                <DropdownMenuItem
                  onSelect={() => setShowDeleteDepartmentDialog(true)}
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
