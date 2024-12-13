import type { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import React from 'react';

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Checkbox } from '@/components/ui/checkbox';
import { UpdateDataSheet } from '@/components/common/update-data-sheet';
import UpdatePartyForm from './update-party-form';
import { DeletePartiesDialog } from './delete-parties-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
// import { getAllDepartments } from '@/db/queries/departments';
// import { getAllFormParties } from '@/db/queries/form-parties';

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
    // {
    //   accessorKey: 'decisionNumber',
    //   meta: {
    //     label: 'Số quyết định',
    //   },
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Số quyết định" />
    //   ),
    //   cell: ({ cell }) => (
    //     <div className="w-full">{cell.getValue() as React.ReactNode}</div>
    //   ),
    //   enableSorting: false,
    //   enableHiding: true,
    // },
    // {
    //   accessorKey: 'decisionDepartment.name',
    //   meta: {
    //     label: 'Cơ quan quyết định',
    //   },
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Cơ quan quyết định" />
    //   ),
    //   cell: ({ cell }) => (
    //     <div className="w-full">{cell.getValue() as React.ReactNode}</div>
    //   ),
    //   enableSorting: false,
    //   enableHiding: true,
    // },
    // {
    //   accessorKey: 'formParty.name',
    //   meta: {
    //     label: 'Hình thức kỷ luật',
    //   },
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Hình thức kỷ luật" />
    //   ),
    //   cell: ({ cell }) => (
    //     <div className="w-full">{cell.getValue() as React.ReactNode}</div>
    //   ),
    //   enableSorting: false,
    //   enableHiding: true,
    // },
    // {
    //   accessorKey: 'decisionDate',
    //   meta: {
    //     label: 'Ngày quyết định',
    //   },
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Ngày quyết định" />
    //   ),
    //   cell: ({ cell }) => (
    //     <div className="w-full">
    //       {
    //         dayjs(cell.getValue() as string).format(
    //           'D-MM-YYYY',
    //         ) as React.ReactNode
    //       }
    //     </div>
    //   ),
    //   enableSorting: false,
    //   enableHiding: true,
    // },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        const [showUpdatePartySheet, setShowUpdatePartySheet] =
          React.useState(false);
        const [showDeletePartyDialog, setShowDeletePartyDialog] =
          React.useState(false);
        React.useEffect(() => {
          // document.body.classList.remove('pointer-events-none');
        });
        // const resultDepartments = React.use(departments);
        // const { data: dataFormParties } = React.use(formParties);
        return (
          <>
            <UpdateDataSheet
              open={showUpdatePartySheet}
              onOpenChange={setShowUpdatePartySheet}
              data={row.original}
              form={UpdatePartyForm}
              dataset={{}}
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
            <DeletePartiesDialog
              name="kỷ luật"
              open={showDeletePartyDialog}
              onOpenChange={setShowDeletePartyDialog}
              parties={[row.original]}
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
                  onSelect={() => setShowUpdatePartySheet(true)}
                >
                  Sửa
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={() => setShowDeletePartyDialog(true)}
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
