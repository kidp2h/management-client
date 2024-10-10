import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import type { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { BookOpen, Cake, CaseUpper, Code, Droplet, Timer } from 'lucide-react';
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';

import { DeleteRecordsDialog } from './delete-record-dialog';
import UpdateRecordForm from './update-record-form';

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
      enableHiding: true,
    },
    {
      accessorKey: 'code',
      meta: {
        label: 'Mã hồ sơ',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mã hồ sơ" />
      ),
      cell: ({ row }) => <div className="w-20">{row.getValue('code')}</div>,
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'fullName',
      meta: {
        label: 'Họ và tên',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Họ và tên" />
      ),
      cell: ({ row }) => (
        <div className="w-fit">{row.getValue('fullName')}</div>
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
        <DataTableColumnHeader column={column} title="Tôn giáo" />
      ),
      cell: ({ row }) => <Badge>{row.getValue('religion')}</Badge>,
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'rank',
      meta: {
        label: 'Trình độ',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trình độ" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center">
          <BookOpen size={100} className="mr-2 size-5 text-muted-foreground" />
          <Badge variant="outline">{row.getValue('rank')}</Badge>
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
        <DataTableColumnHeader column={column} title="Ngày sinh" />
      ),
      cell: ({ cell }) => (
        <div className="flex w-[6.25rem] items-center">
          <Cake className="mr-2 size-5 text-muted-foreground" />
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
        <DataTableColumnHeader column={column} title="Tiếng Anh" />
      ),
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.getValue('englishCertification')}
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
        <DataTableColumnHeader column={column} title="Tin học" />
      ),
      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.getValue('technologyCertification')}
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
        <DataTableColumnHeader column={column} title="Nhóm máu" />
      ),
      cell: ({ row }) => (
        <div className="flex w-[6.25rem] items-center">
          <Droplet className="mr-2 size-5 text-muted-foreground" />
          <Badge variant="destructive">{row.getValue('bloodType')}</Badge>
        </div>
      ),
    },
    {
      accessorKey: 'isPartyMember',
      meta: {
        label: 'Đảng viên',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Đảng viên" />
      ),
      cell: ({ row }) => (
        <div className="flex w-[6.25rem] items-center">
          <Switch
            id="terms1"
            checked={row.getValue('isPartyMember')}
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
        <DataTableColumnHeader column={column} title="Ngày tạo" />
      ),
      cell: ({ cell }) => (
        <div className="flex w-[6.25rem] items-center">
          <Timer className="mr-2 size-5 text-muted-foreground" />
          <span>{dayjs(cell.getValue() as Date).format('D-MM-YYYY')}</span>
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
        return (
          <>
            <UpdateDataSheet<any>
              open={showUpdateRecordSheet}
              onOpenChange={setShowUpdateRecordSheet}
              data={row.original}
              form={UpdateRecordForm}
              name="tôn giáo"
              fieldConfig={{
                fullName: {
                  inputProps: {
                    type: 'text',
                    placeholder: row.original.fullName,
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
                code: {
                  inputProps: {
                    type: 'text',
                    placeholder: row.original.code,
                    defaultValue: row.original.code,
                  },
                  icon: Code,
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
                religionId: {
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
                degree: {
                  inputProps: {
                    placeholder: row.original.degree,
                    defaultValue: row.original.degree,
                  },
                },
              }}
            />
            <DeleteRecordsDialog
              name="tôn giáo"
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
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
      size: 40,
    },
  ];
}
