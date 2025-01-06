import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import type { ColumnDef } from '@tanstack/react-table';
import React from 'react';

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ApproveRecordDialog } from './approve-record-dialog';
import { DetailChangesRecordDialog } from './detail-changes-record-dialog';
import { useRouter } from 'next/navigation';
import { encode } from 'js-base64';

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
        label: 'Mã hồ sơ',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mã hồ sơ" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'record.fullName',
      meta: {
        label: 'CBCCVC',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="CBCCVC" />
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
        const [showDetailChangeDialog, setShowDetailChangeDialog] =
          React.useState(false);
        const [showApproveRecordDialog, setShowApproveRecordDialog] =
          React.useState(false);
        React.useEffect(() => {
          // document.body.classList.remove('pointer-events-none');
        });
        const router = useRouter();

        return (
          <>
            {/* {JSON.stringify(row.original)} */}
            <ApproveRecordDialog
              name="đơn vị"
              open={showApproveRecordDialog}
              onOpenChange={setShowApproveRecordDialog}
              approve={row.original}
              showTrigger={false}
              onSuccess={() => row.toggleSelected(false)}
            />
            <DetailChangesRecordDialog
              name="đơn vị"
              open={showDetailChangeDialog}
              onOpenChange={setShowDetailChangeDialog}
              approve={row.original}
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
                    router.replace(`/record/${encode(row.original.recordId)}`)
                  }
                >
                  Xem chi tiết hồ sơ
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setShowDetailChangeDialog(true)}
                >
                  Xem chi tiết sự thay đổi
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={() => setShowApproveRecordDialog(true)}
                >
                  Duyệt hồ sơ
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