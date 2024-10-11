import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import type { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import {
  CircleUser,
  History,
  ImageIcon,
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
      accessorKey: 'imageUrl',
      meta: {
        label: 'Ảnh đại diện',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <ImageIcon className="mr-2 size-5 text-blue-500 " />
          <DataTableColumnHeader column={column} title="Ảnh đại diện" />
        </div>
      ),
      cell: ({}) => (
        <div className="flex w-[6.25rem] items-center">
          <Badge
            variant="outline"
            roundedType="md"
            className="cursor-pointer text-blue-500 underline"
          >
            Xem chi tiết
          </Badge>
        </div>
      ),
    },

    {
      accessorKey: 'username',
      meta: {
        label: 'Tài khoản',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <CircleUser className="mr-2 size-5 text-muted-foreground " />
          <DataTableColumnHeader column={column} title="Tài khoản" />
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
          <Badge roundedType="md" className="flex w-full justify-center">
            {cell.getValue()}
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

                {/* <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Tiếng Anh</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={row.original.label}
                      onValueChange={value => {
                        startUpdateTransition(() => {
                          if (value) {
                            toast.promise(
                              updateUser({
                                id: row.original.id,
                                englishCertification: value,
                              }),
                              {
                                loading: 'Đang cập nhật...',
                                success: 'Cập nhật thành công',
                                error: 'Cập nhật thất bại',
                              },
                            );
                          }
                        });
                      }}
                    >
                      {users.englishCertification.enumValues.map(
                        (label: string) => (
                          <DropdownMenuRadioItem
                            key={label}
                            value={label}
                            disabled={
                              isUpdatePending ||
                              label === row.original.englishCertification
                            }
                          >
                            <div className="flex flex-row items-center justify-center gap-2">
                              {label}
                              {label === row.original.englishCertification && (
                                <Star className="size-4" />
                              )}
                            </div>
                          </DropdownMenuRadioItem>
                        ),
                      )}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Tin học</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={row.original.label}
                      onValueChange={value => {
                        startUpdateTransition(() => {
                          if (value) {
                            toast.promise(
                              updateUser({
                                id: row.original.id,
                                technologyCertification: value,
                              }),
                              {
                                loading: 'Đang cập nhật...',
                                success: 'Cập nhật thành công',
                                error: 'Cập nhật thất bại',
                              },
                            );
                          }
                        });
                      }}
                    >
                      {users.technologyCertification.enumValues.map(
                        (label: string) => (
                          <DropdownMenuRadioItem
                            key={label}
                            value={label}
                            disabled={
                              isUpdatePending ||
                              label === row.original.technologyCertification
                            }
                          >
                            <div className="flex flex-row items-center justify-center gap-2">
                              {label}
                              {label ===
                                row.original.technologyCertification && (
                                <Star className="size-4" />
                              )}
                            </div>
                          </DropdownMenuRadioItem>
                        ),
                      )}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Tôn giáo</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={row.original.label}
                      onValueChange={value => {
                        startUpdateTransition(() => {
                          if (value) {
                            toast.promise(
                              updateUser({
                                id: row.original.id,
                                religionId: value,
                              }),
                              {
                                loading: 'Đang cập nhật...',
                                success: 'Cập nhật thành công',
                                error: 'Cập nhật thất bại',
                              },
                            );
                          }
                        });
                      }}
                    >
                      {religions.map(rel => (
                        <DropdownMenuRadioItem
                          key={rel.id}
                          value={rel.id}
                          disabled={
                            isUpdatePending ||
                            rel.id === row.original.religionId
                          }
                        >
                          <div className="flex flex-row items-center justify-center gap-2">
                            {rel.name}
                            {rel.id === row.original.religionId && (
                              <Star className="size-4" />
                            )}
                          </div>
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Cấp bậc</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={row.original.label}
                      onValueChange={value => {
                        startUpdateTransition(() => {
                          if (value) {
                            toast.promise(
                              updateUser({
                                id: row.original.id,
                                rankId: value,
                              }),
                              {
                                loading: 'Đang cập nhật...',
                                success: 'Cập nhật thành công',
                                error: 'Cập nhật thất bại',
                              },
                            );
                          }
                        });
                      }}
                    >
                      {ranks.map(r => (
                        <DropdownMenuRadioItem
                          key={r.id}
                          value={r.id}
                          disabled={
                            isUpdatePending || r.id === row.original.rankId
                          }
                        >
                          <div className="flex flex-row items-center justify-center gap-2">
                            {r.name}
                            {r.id === row.original.rankId && (
                              <Star className="size-4" />
                            )}
                          </div>
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
      size: 40,
    },
  ];
}
