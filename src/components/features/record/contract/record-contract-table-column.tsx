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
import { DeleteContractsDialog } from './delete-contracts-dialog';
import UpdateContractForm from './update-contract-form';

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
      accessorKey: 'typeContract',
      meta: {
        label: 'Loại hình',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Loại hình" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'formRecruitment.name',
      meta: {
        label: 'Hình thức tuyển dụng',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Hình thức tuyển dụng" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'dateRecruiment',
      meta: {
        label: 'Ngày tuyển dụng',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngày tuyển dụng" />
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
      accessorKey: 'decisionNumber',
      meta: {
        label: 'Số quyết định',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Số quyết định" />
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
        const [showUpdateContractSheet, setShowUpdateContractSheet] =
          React.useState(false);
        const [showDeleteContractDialog, setShowDeleteContractDialog] =
          React.useState(false);
        React.useEffect(() => {
          // document.body.classList.remove('pointer-events-none');
        });
        return (
          <>
            <UpdateDataSheet
              open={showUpdateContractSheet}
              onOpenChange={setShowUpdateContractSheet}
              data={row.original}
              form={UpdateContractForm}
              name="hợp đồng"
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
                typeContract: {
                  inputProps: {
                    placeholder: row.original.typeContract,
                    defaultValue: row.original.typeContract,
                    value: row.original.typeContract,
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
            <DeleteContractsDialog
              name="hợp đồng"
              open={showDeleteContractDialog}
              onOpenChange={setShowDeleteContractDialog}
              contracts={[row.original]}
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
                  onSelect={() => setShowUpdateContractSheet(true)}
                >
                  Sửa
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={() => setShowDeleteContractDialog(true)}
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
