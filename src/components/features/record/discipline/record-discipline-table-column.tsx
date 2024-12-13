import type { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import React from 'react';

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Checkbox } from '@/components/ui/checkbox';
import { UpdateDataSheet } from '@/components/common/update-data-sheet';
import UpdateDisciplineForm from './update-discipline-form';
import { DeleteDisciplinesDialog } from './delete-disciplines-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { getAllDepartments } from '@/db/queries/departments';
import { getAllFormDisciplines } from '@/db/queries/form-disciplines';

export function getColumns(
  departments: ReturnType<typeof getAllDepartments>,
  formDisciplines: ReturnType<typeof getAllFormDisciplines>,
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
      accessorKey: 'record.code',
      meta: {
        label: 'Mã cán bộ',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mã cán bộ" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as React.ReactNode}</div>
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
      accessorKey: 'decisionDepartment.name',
      meta: {
        label: 'Cơ quan quyết định',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cơ quan quyết định" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as React.ReactNode}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'formDiscipline.name',
      meta: {
        label: 'Hình thức kỷ luật',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Hình thức kỷ luật" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as React.ReactNode}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'decisionDate',
      meta: {
        label: 'Ngày quyết định',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngày quyết định" />
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
        const [showUpdateDisciplineSheet, setShowUpdateDisciplineSheet] =
          React.useState(false);
        const [showDeleteDisciplineDialog, setShowDeleteDisciplineDialog] =
          React.useState(false);
        React.useEffect(() => {
          // document.body.classList.remove('pointer-events-none');
        });
        const resultDepartments = React.use(departments);
        const { data: dataFormDisciplines } = React.use(formDisciplines);
        return (
          <>
            <UpdateDataSheet
              open={showUpdateDisciplineSheet}
              onOpenChange={setShowUpdateDisciplineSheet}
              data={row.original}
              form={UpdateDisciplineForm}
              dataset={{
                departments: resultDepartments?.data || [],
                formDisciplines: dataFormDisciplines,
              }}
              name="kỷ luật"
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
              }}
            />
            <DeleteDisciplinesDialog
              name="kỷ luật"
              open={showDeleteDisciplineDialog}
              onOpenChange={setShowDeleteDisciplineDialog}
              disciplines={[row.original]}
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
                  onSelect={() => setShowUpdateDisciplineSheet(true)}
                >
                  Sửa
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={() => setShowDeleteDisciplineDialog(true)}
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
