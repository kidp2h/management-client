import type { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import React from 'react';

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Checkbox } from '@/components/ui/checkbox';
import { UpdateDataSheet } from '@/components/common/update-data-sheet';
import UpdateDualForm from './update-dual-form';
import { DeleteDualsDialog } from './delete-duals-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import {
  getDepartmentsByRecord,
} from '@/db/queries/departments';

export function getColumns(
  departmentsOfRecord?: ReturnType<typeof getDepartmentsByRecord>,
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
    {
      accessorKey: 'startDate',
      meta: {
        label: 'Ngày bắt đầu',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngày bắt đầu" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">
          {
            dayjs(cell.getValue() as string).format(
              'D-MM-YYYY',
            ) as React.ReactNode
          }
        </div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'endDate',
      meta: {
        label: 'Ngày kết thúc',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngày kết thúc" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">
          {
            dayjs(cell.getValue() as string).format(
              'D-MM-YYYY',
            ) as React.ReactNode
          }
        </div>
      ),
      enableSorting: false,
      enableHiding: true,
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
        <div className="w-full">{cell.getValue() as React.ReactNode}</div>
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
        <div className="w-full">{cell.getValue() as React.ReactNode}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'department.name',
      meta: {
        label: 'Đơn vị',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Đơn vị" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as React.ReactNode}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'duty.name',
      meta: {
        label: 'Chức vụ',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Chức vụ" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as React.ReactNode}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'issuer',
      meta: {
        label: 'Cơ quan ban hành',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cơ quan ban hành" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as React.ReactNode}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'dateOfIssue',
      meta: {
        label: 'Ngày ban hành',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngày ban hành" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">
          {
            dayjs(cell.getValue() as string).format(
              'D-MM-YYYY',
            ) as React.ReactNode
          }
        </div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        const [showUpdateDualSheet, setShowUpdateDualSheet] =
          React.useState(false);
        const [showDeleteDualDialog, setShowDeleteDualDialog] =
          React.useState(false);
        React.useEffect(() => {
          // document.body.classList.remove('pointer-events-none');
        });
        let resultDepartments: any = null;
        if (departmentsOfRecord) {
          resultDepartments = React.use(departmentsOfRecord);
        }

        return (
          <>
            {resultDepartments && (
              <UpdateDataSheet
                open={showUpdateDualSheet}
                onOpenChange={setShowUpdateDualSheet}
                data={row.original}
                form={UpdateDualForm}
                dataset={{
                  departmentsOfRecord: resultDepartments,
                }}
                name="kỷ luật"
                fieldConfig={{
                  from: {
                    inputProps: {
                      placeholder: dayjs(row.original.from).format(
                        'DD-MM-YYYY',
                      ),
                    },
                  },
                  to: {
                    inputProps: {
                      placeholder: dayjs(row.original.to).format('DD-MM-YYYY'),
                    },
                  },
                }}
              />
            )}
            <DeleteDualsDialog
              name="kỷ luật"
              open={showDeleteDualDialog}
              onOpenChange={setShowDeleteDualDialog}
              duals={[row.original]}
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
                <DropdownMenuItem onSelect={() => setShowUpdateDualSheet(true)}>
                  Sửa
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={() => setShowDeleteDualDialog(true)}
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
