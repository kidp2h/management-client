import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import type { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { encode } from 'js-base64';
import {
  BookCheck,
  BookOpenText,
  Building,
  Cake,
  CaseUpper,
  Check,
  Cpu,
  Dna,
  Droplet,
  HeartPulse,
  ScanBarcode,
  Timer,
  TypeOutline,
  University,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { updateRecord } from '@/db/actions/records';
import type { Ranks } from '@/db/schema';
import { enumReligions, records } from '@/db/schema';
import { cn } from '@/lib/utils';

import { DeleteRecordsDialog } from './delete-record-dialog';
import UpdateRecordForm from './update-record-form';

export interface DataColumnsRecords {
  ranks: Ranks[];
}

export function getColumns({ ranks }: DataColumnsRecords): ColumnDef<any>[] {
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
      accessorKey: 'code',
      meta: {
        label: 'Mã hồ sơ',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <ScanBarcode className="mr-2 size-5 text-muted-foreground" />
          <DataTableColumnHeader column={column} title="Mã hồ sơ" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="w-full font-mono">{row.getValue('code')}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'fullName',
      meta: {
        label: 'Họ và tên',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <TypeOutline className="mr-2 size-5 text-pink-500" />
          <DataTableColumnHeader column={column} title="Họ và tên" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="w-fit">{row.getValue('fullName')}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'gender',
      meta: {
        label: 'Giới tính',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <Dna className="mr-2 size-5 text-pink-900" />
          <DataTableColumnHeader column={column} title="Giới tính" />
        </div>
      ),
      cell: ({ row }) => (
        <Badge
          roundedType="md"
          variant="outline"
          className={cn(
            ' text-white',
            row.getValue('gender') === 'Nam' ? 'bg-indigo-500' : 'bg-pink-500',
          )}
        >
          {row.getValue('gender') || 'Chưa cập nhật'}
        </Badge>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'religion',
      meta: {
        label: 'Tôn giáo',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <University className="mr-2 size-5 text-indigo-500" />
          <DataTableColumnHeader column={column} title="Tôn giáo" />
        </div>
      ),
      cell: ({ row }) => (
        <Badge
          roundedType="md"
          variant="outline"
          className={cn(
            ' text-card-foreground',
            row.getValue('religion') ? 'bg-indigo-500 text-white' : 'bg-none',
          )}
        >
          {row.getValue('religion') || 'Chưa cập nhật'}
        </Badge>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'rank',
      meta: {
        label: 'Trình độ',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <BookOpenText className="mr-2 size-5 text-green-500" />
          <DataTableColumnHeader column={column} title="Trình độ" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center">
          <Badge
            roundedType="md"
            variant="outline"
            className={cn(
              'text-card-foreground',
              row.getValue('rank') ? 'bg-green-500 text-white' : 'bg-none',
            )}
          >
            {row.getValue('rank') || 'Chưa cập nhật'}
          </Badge>
        </div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'birthday',
      meta: {
        label: 'Ngày sinh',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <Cake className="mr-2 size-5 text-red-500" />
          <DataTableColumnHeader column={column} title="Ngày sinh" />
        </div>
      ),
      cell: ({ cell }) => (
        <div className="flex w-[6.25rem] items-center">
          <span>{dayjs(cell.getValue() as Date).format('D-MM-YYYY')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'englishCertification',
      meta: {
        label: 'Tiếng Anh',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <BookCheck className="mr-2 size-5 text-cyan-500" />
          <DataTableColumnHeader column={column} title="Tiếng Anh" />
        </div>
      ),
      cell: ({ row }) => (
        <Badge
          roundedType="md"
          variant="outline"
          className={cn(
            'text-card-foreground',
            row.getValue('englishCertification')
              ? 'bg-cyan-500 text-white'
              : 'bg-none',
          )}
        >
          {row.getValue('englishCertification') || 'Chưa cập nhật'}
        </Badge>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'technologyCertification',
      meta: {
        label: 'Tin học',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <Cpu className="mr-2 size-5 text-blue-500" />
          <DataTableColumnHeader column={column} title="Tin học" />
        </div>
      ),
      cell: ({ row }) => (
        <Badge
          roundedType="md"
          variant="outline"
          className={cn(
            'text-card-foreground',
            row.getValue('technologyCertification')
              ? 'bg-blue-500 text-white'
              : 'bg-none',
          )}
        >
          {row.getValue('technologyCertification') || 'Chưa cập nhật'}
        </Badge>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'bloodType',
      meta: {
        label: 'Nhóm máu',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <HeartPulse className="mr-2 size-5 text-red-500" />
          <DataTableColumnHeader column={column} title="Nhóm máu" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex w-full items-center">
          <Badge
            roundedType="md"
            variant="outline"
            className={cn(
              'text-card-foreground',
              row.getValue('bloodType') ? 'bg-red-500 text-white' : 'bg-none',
            )}
          >
            {row.getValue('bloodType') || 'Chưa cập nhật'}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: 'isPartyMember',
      meta: {
        label: 'Đảng viên',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <Building className="mr-2 size-5 text-yellow-500" />
          <DataTableColumnHeader column={column} title="Đảng viên" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex w-[6.25rem] items-center">
          <Switch
            id="terms1"
            checked={row.getValue('isPartyMember')}
            color="yellow"
            disabled
          />
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      meta: {
        label: 'Ngày tạo',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <Timer className="mr-2 size-5 text-orange-500" />
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
        const [showUpdateRecordSheet, setShowUpdateRecordSheet] =
          React.useState(false);
        const [showDeleteRecordDialog, setShowDeleteRecordDialog] =
          React.useState(false);
        React.useEffect(() => {});
        const router = useRouter();
        const [isUpdatePending, startUpdateTransition] = React.useTransition();
        return (
          <>
            <UpdateDataSheet<any>
              open={showUpdateRecordSheet}
              onOpenChange={setShowUpdateRecordSheet}
              data={row.original}
              form={UpdateRecordForm}
              name="hồ sơ"
              fieldConfig={{
                fullName: {
                  inputProps: {
                    type: 'text',
                    placeholder: row.original.fullName,
                    defaultValue: row.original.fullName,
                  },
                  icon: CaseUpper,
                },
                bloodType: {
                  inputProps: {
                    placeholder: row.original.bloodType,
                    defaultValue: row.original.bloodType,
                  },
                  icon: Droplet,
                },
                birthday: {
                  inputProps: {
                    // date: row.original.birthday,
                    placeholder: dayjs(row.original.birthday).format(
                      'DD-MM-YYYY',
                    ),
                  },
                },

                englishCertification: {
                  inputProps: {
                    placeholder: row.original.englishCertification,
                    defaultValue: row.original.englishCertification,
                  },
                },
                technologyCertification: {
                  inputProps: {
                    placeholder: row.original.technologyCertification,
                    defaultValue: row.original.technologyCertification,
                  },
                },
                religion: {
                  inputProps: {
                    placeholder: row.original.religion,
                    defaultValue: row.original.religion,
                  },
                },
                rankId: {
                  inputProps: {
                    placeholder: row.original.rank,
                    defaultValue: row.original.rank,
                  },
                },

                isPartyMember: {
                  inputProps: {
                    defaultChecked: row.original.isPartyMember,
                  },
                },
                gender: {
                  inputProps: {
                    placeholder: row.original.gender,
                    defaultValue: row.original.gender,
                  },
                },
                degree: {
                  inputProps: {
                    placeholder: row.original.degree,
                    defaultValue: row.original.degree,
                  },
                },
              }}
            />
            <DeleteRecordsDialog
              name="hồ sơ"
              open={showDeleteRecordDialog}
              onOpenChange={setShowDeleteRecordDialog}
              records={[row.original]}
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
                  onSelect={() =>
                    router.replace(`/record/${encode(row.original.id)}`)
                  }
                >
                  Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuLabel className="text-xs font-bold uppercase text-muted-foreground">
                  Thao tác
                </DropdownMenuLabel>
                <DropdownMenuItem
                  onSelect={() => setShowUpdateRecordSheet(true)}
                >
                  Sửa
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={() => setShowDeleteRecordDialog(true)}
                >
                  Xoá
                  {/* <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut> */}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-bold uppercase text-muted-foreground">
                  Chỉnh sửa nhanh
                </DropdownMenuLabel>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Tiếng Anh</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={row.original.label}
                      onValueChange={value => {
                        startUpdateTransition(() => {
                          if (value) {
                            toast.promise(
                              updateRecord({
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
                      {records.englishCertification.enumValues.map(
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
                                <Check className="size-4" />
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
                              updateRecord({
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
                      {records.technologyCertification.enumValues.map(
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
                                <Check className="size-4" />
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
                              updateRecord({
                                id: row.original.id,
                                religion: value,
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
                      {enumReligions.map(rel => (
                        <DropdownMenuRadioItem
                          key={rel}
                          value={rel}
                          disabled={
                            isUpdatePending || rel === row.original.religion
                          }
                        >
                          <div className="flex flex-row items-center justify-center gap-2">
                            {rel}
                            {rel === row.original.religion && (
                              <Check className="size-4" />
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
                              updateRecord({
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
                              <Check className="size-4" />
                            )}
                          </div>
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
      size: 40,
    },
  ];
}
