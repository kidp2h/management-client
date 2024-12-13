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
import { DeleteCommendationsDialog } from './delete-commendations-dialog';
import UpdateCommendationForm from './update-commendation-form';
import { getAllAppellations } from '@/db/queries/appellations';

export function getColumns(
  appellations: ReturnType<typeof getAllAppellations>,
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
      accessorKey: 'award.name',
      meta: {
        label: 'Danh hiệu / Huy chương / Huân chương',
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Danh hiệu / Huy chương / Huân chương"
        />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'year',
      meta: {
        label: 'Năm được khen thưởng',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Năm được khen thưởng" />
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
        const [showUpdateCommendationSheet, setShowUpdateCommendationSheet] =
          React.useState(false);
        const [showDeleteCommendationDialog, setShowDeleteCommendationDialog] =
          React.useState(false);
        React.useEffect(() => {
          // document.body.classList.remove('pointer-events-none');
        });
        const { data } = React.use(appellations);
        return (
          <>
            <UpdateDataSheet
              open={showUpdateCommendationSheet}
              onOpenChange={setShowUpdateCommendationSheet}
              data={row.original}
              form={UpdateCommendationForm}
              dataset={{ appellations: data }}
              name="khen thưởng"
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
            <DeleteCommendationsDialog
              name="khen thưởng"
              open={showDeleteCommendationDialog}
              onOpenChange={setShowDeleteCommendationDialog}
              commendations={[row.original]}
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
                  onSelect={() => setShowUpdateCommendationSheet(true)}
                >
                  Sửa
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={() => setShowDeleteCommendationDialog(true)}
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
