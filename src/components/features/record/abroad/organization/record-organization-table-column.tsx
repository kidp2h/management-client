import type { ColumnDef } from '@tanstack/react-table';

import { Checkbox } from '@/components/ui/checkbox';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
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
import { DeleteOrganizationsDialog } from './delete-organization-dialog';
import UpdateOrganizationForm from './update-organization-form';

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
      accessorKey: 'organization',
      meta: {
        label: 'Tổ chức',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tổ chức" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'located',
      meta: {
        label: 'Trụ sở đặt ở đâu',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trụ sở đặt ở đâu" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'do',
      meta: {
        label: 'Làm gì',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Làm gì" />
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
        const [showUpdateOrganizationSheet, setShowUpdateOrganizationSheet] =
          React.useState(false);
        const [showDeleteOrganizationDialog, setShowDeleteOrganizationDialog] =
          React.useState(false);
        React.useEffect(() => {
          // document.body.classList.remove('pointer-events-none');
        });
        return (
          <>
            <UpdateDataSheet
              open={showUpdateOrganizationSheet}
              onOpenChange={setShowUpdateOrganizationSheet}
              data={row.original}
              form={UpdateOrganizationForm}
              name="tổ chức nước ngoài"
              fieldConfig={{}}
            />
            <DeleteOrganizationsDialog
              name="tổ chức nước ngoài"
              open={showDeleteOrganizationDialog}
              onOpenChange={setShowDeleteOrganizationDialog}
              organizations={[row.original]}
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
                  onSelect={() => setShowUpdateOrganizationSheet(true)}
                >
                  Sửa
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={() => setShowDeleteOrganizationDialog(true)}
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
