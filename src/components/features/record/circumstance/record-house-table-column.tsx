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
import { DeleteHousesDialog } from './delete-houses-dialog';
import UpdateHouseForm from './update-house-form';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

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
      accessorKey: 'typeHouse',
      meta: {
        label: 'Loại nhà',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Loại nhà" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'area',
      meta: {
        label: 'Diện tích (㎡)',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Diện tích (㎡)" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'documents',
      meta: {
        label: 'Tài liệu chứng nhận sỡ hữu',
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Tài liệu chứng nhận sỡ hữu"
        />
      ),
      cell: ({ cell }) => {
        // console.log(cell.getValue());
        return (
          <div className="w-full flex flex-row gap-2">
            {(cell.getValue() as any)?.map((doc: any) => (
              <Link href={doc.split('|')[0]} key={doc} target="_blank">
                <Badge
                  variant="outline"
                  className="cursor-pointer hover:underline"
                >
                  {doc.split('|')[1].slice(0, 5)}....
                  {doc.split('|')[1].split('.')[1].toUpperCase()}
                </Badge>
              </Link>
            ))}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        const [showUpdateHouseSheet, setShowUpdateHouseSheet] =
          React.useState(false);
        const [showDeleteHouseDialog, setShowDeleteHouseDialog] =
          React.useState(false);
        React.useEffect(() => {
          // document.body.classList.remove('pointer-events-none');
        });
        return (
          <>
            <UpdateDataSheet
              open={showUpdateHouseSheet}
              onOpenChange={setShowUpdateHouseSheet}
              data={row.original}
              form={UpdateHouseForm}
              name="Nhà ở"
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
            <DeleteHousesDialog
              name="nhà ở"
              open={showDeleteHouseDialog}
              onOpenChange={setShowDeleteHouseDialog}
              houses={[row.original]}
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
                  onSelect={() => setShowUpdateHouseSheet(true)}
                >
                  Sửa
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={() => setShowDeleteHouseDialog(true)}
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
