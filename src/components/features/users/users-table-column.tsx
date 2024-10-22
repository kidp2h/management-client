import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import type { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import {
  CircleUser,
  FileText,
  History,
  Key,
  ShieldPlus,
  Timer,
  UserCircle,
} from 'lucide-react';
import React from 'react';

import { UpdateDataSheet } from '@/components/common/update-data-sheet';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { DeleteUsersDialog } from './delete-user-dialog';
import UpdateUserForm from './update-user-form';

export interface DataColumnsUsers {}

export function getColumns(): ColumnDef<any, any>[] {
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
      enableHiding: true,
    },

    {
      accessorKey: 'publicMetadata.record.code',
      meta: {
        label: 'Hồ sơ',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <FileText className="mr-2 size-5 text-pink-500 " />
          <DataTableColumnHeader column={column} title="Hồ sơ" />
        </div>
      ),
      cell: ({ cell }) => (
        <div className="flex w-full items-center">
          <Badge
            roundedType="md"
            variant={cell.getValue() ? 'default' : 'outline'}
            className="flex w-full justify-center"
          >
            {cell.getValue() || 'Chưa có'}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: 'username',
      meta: {
        label: 'Mã cán bộ',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <CircleUser className="mr-2 size-5 text-muted-foreground " />
          <DataTableColumnHeader column={column} title="Mã cán bộ" />
        </div>
      ),
      cell: ({ cell }) => (
        <div className="flex w-[6.25rem] items-center">
          <span>{cell.getValue()}</span>
        </div>
      ),
    },
    {
      accessorKey: 'publicMetadata.role',
      meta: {
        label: 'Vai trò',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <ShieldPlus className="mr-2 size-5 text-indigo-500 " />
          <DataTableColumnHeader column={column} title="Vai trò" />
        </div>
      ),
      cell: ({ cell }) => (
        <div className="flex w-[6.25rem] items-center">
          <Badge
            roundedType="md"
            className="flex w-full justify-center"
            variant={cell.getValue() ? 'default' : 'outline'}
          >
            {cell.getValue() || 'Chưa có'}
          </Badge>
        </div>
      ),
    },

    // {
    //   accessorKey: 'lastName',
    //   meta: {
    //     label: 'Họ',
    //   },
    //   header: ({ column }) => (
    //     <div className="flex flex-row items-center gap-1 ">
    //       <Heading className="mr-2 size-5 text-pink-500" />
    //       <DataTableColumnHeader column={column} title="Họ" />
    //     </div>
    //   ),
    //   cell: ({ cell }) => (
    //     <div className="flex w-[6.25rem] items-center">
    //       <span>{cell.getValue()}</span>
    //     </div>
    //   ),
    // },
    // {
    //   accessorKey: 'firstName',
    //   meta: {
    //     label: 'Tên',
    //   },
    //   header: ({ column }) => (
    //     <div className="flex flex-row items-center gap-1 ">
    //       <Type className="mr-2 size-5 text-pink-400" />
    //       <DataTableColumnHeader column={column} title="Tên" />
    //     </div>
    //   ),
    //   cell: ({ cell }) => (
    //     <div className="flex w-[6.25rem] items-center">
    //       <span>{cell.getValue()}</span>
    //     </div>
    //   ),
    // },

    {
      accessorKey: 'updatedAt',
      meta: {
        label: 'Cập nhật lúc',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <History className="mr-2 size-5 text-orange-500" />
          <DataTableColumnHeader column={column} title="Cập nhật lúc" />
        </div>
      ),
      cell: ({ cell }) => (
        <div className="flex w-fit items-center">
          <span className="flex flex-row items-center gap-2 whitespace-nowrap">
            <Badge roundedType="md" variant="outline">
              {dayjs(cell.getValue() as Date).format('D-MM-YYYY')}
            </Badge>
            {dayjs(cell.getValue() as Date).format('hh:mm:ss')}
          </span>
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      meta: {
        label: 'Ngày tạo',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1">
          <Timer className="mr-2 size-5 text-orange-400" />
          <DataTableColumnHeader column={column} title="Ngày tạo" />
        </div>
      ),
      cell: ({ cell }) => (
        <div className="flex w-fit items-center">
          <span className="flex flex-row items-center gap-2 whitespace-nowrap">
            <Badge roundedType="md" variant="outline">
              {dayjs(cell.getValue() as Date).format('D-MM-YYYY')}
            </Badge>
            {dayjs(cell.getValue() as Date).format('hh:mm:ss')}
          </span>
        </div>
      ),
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        const [showUpdateUserSheet, setShowUpdateUserSheet] =
          React.useState(false);
        const [showDeleteUserDialog, setShowDeleteUserDialog] =
          React.useState(false);
        React.useEffect(() => {});
        // const [isUpdatePending, startUpdateTransition] = React.useTransition();
        return (
          <>
            <UpdateDataSheet<any>
              open={showUpdateUserSheet}
              onOpenChange={setShowUpdateUserSheet}
              data={row.original}
              form={UpdateUserForm}
              name="tôn giáo"
              fieldConfig={{
                username: {
                  inputProps: {
                    type: 'text',
                    placeholder: row.original.username,
                  },
                  icon: UserCircle,
                },
                password: {
                  inputProps: {
                    type: 'text',
                    placeholder: 'Mật khẩu',
                  },
                  icon: Key,
                },
              }}
            />
            <DeleteUsersDialog
              name="tôn giáo"
              open={showDeleteUserDialog}
              onOpenChange={setShowDeleteUserDialog}
              users={[row.original]}
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
                <DropdownMenuLabel className="text-xs font-bold uppercase text-muted-foreground">
                  Thao tác
                </DropdownMenuLabel>
                <DropdownMenuItem onSelect={() => setShowUpdateUserSheet(true)}>
                  Sửa
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={() => setShowDeleteUserDialog(true)}
                >
                  Xoá
                  {/* <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut> */}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-bold uppercase text-muted-foreground">
                  Chỉnh sửa nhanh
                </DropdownMenuLabel>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
      size: 40,
    },
  ];
}
