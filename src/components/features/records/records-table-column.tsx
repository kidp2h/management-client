import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import type { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { encode } from 'js-base64';
import {
  Cake,
  CaseUpper,
  Check,
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
import { updateRecord } from '@/db/actions/records';
import { cn } from '@/lib/utils';

import { DeleteRecordsDialog } from './delete-record-dialog';
import UpdateRecordForm from './update-record-form';
import { getAllReligions } from '@/db/queries/religions';

export interface DataColumnsRecords {}

export function getColumns(
  religions: ReturnType<typeof getAllReligions>,
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
      accessorKey: 'religion.name',
      meta: {
        label: 'Tôn giáo',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <University className="mr-2 size-5 text-indigo-500" />
          <DataTableColumnHeader column={column} title="Tôn giáo" />
        </div>
      ),
      cell: ({ row, cell }) => (
        <Badge
          roundedType="md"
          variant="outline"
          className={cn(
            ' text-card-foreground',
            cell.getValue() ? 'bg-indigo-500 text-white' : 'bg-none',
          )}
        >
          {(cell.getValue() as string) || 'Chưa cập nhật'}
        </Badge>
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
        <div className="flex w-full items-center">
          <span>{dayjs(cell.getValue() as Date).format('D-MM-YYYY')}</span>
        </div>
      ),
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
        const { data: dataReligions } = React.use(religions);
        return (
          <>
            <UpdateDataSheet
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
                qualification: {
                  inputProps: {
                    placeholder: row.original.qualification,
                    defaultValue: row.original.qualification,
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
                      {dataReligions?.map(rel => (
                        <DropdownMenuRadioItem
                          key={rel.id}
                          value={rel.id}
                          disabled={
                            isUpdatePending || rel.id === row.original.religion
                          }
                        >
                          <div className="flex flex-row items-center justify-center gap-2">
                            {rel.name}
                            {rel.id === row.original.religion && (
                              <Check className="size-4" />
                            )}
                          </div>
                        </DropdownMenuRadioItem>
                      )) || []}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                {/* <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Cấp bậc</DropdownMenuSubTrigger>
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
