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
import { DeleteSalariesDialog } from './delete-salaries-dialog';
import UpdateSalaryForm from './update-salary-form';
import { getAllSalaryGrades } from '@/db/queries/salary-grades';
import { getAllCivilServantRanks } from '@/db/queries/civil-servant-ranks';
import { getAllPublicEmployeeRanks } from '@/db/queries/public-employee-ranks';

export function getColumns(
  salaryGrades: ReturnType<typeof getAllSalaryGrades>,
  civilServantRanks: ReturnType<typeof getAllCivilServantRanks>,
  publicEmployeeRanks: ReturnType<typeof getAllPublicEmployeeRanks>,
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
      accessorKey: 'at',
      meta: {
        label: 'Tháng/Năm',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tháng/Năm" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">
          {dayjs(cell.getValue() as Date).format('MM-YYYY')}
        </div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'classification.name',
      meta: {
        label: 'Ngạch',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngạch" />
      ),
      cell: ({ row, cell }) => (
        <div className="w-full">
          {typeof cell.getValue() === 'string'
            ? (cell.getValue() as string)
            : (row.original.namePublicRank as string)}
        </div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'salaryGrade.name',
      meta: {
        label: 'Bậc lương',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Bậc lương" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'salaryFactor',
      meta: {
        label: 'Hệ số lương',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Hệ số lương" />
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
        const [showUpdateSalarySheet, setShowUpdateSalarySheet] =
          React.useState(false);
        const [showDeleteSalaryDialog, setShowDeleteSalaryDialog] =
          React.useState(false);
        React.useEffect(() => {
          // document.body.classList.remove('pointer-events-none');
        });

        return (
          <>
            <UpdateDataSheet
              open={showUpdateSalarySheet}
              onOpenChange={setShowUpdateSalarySheet}
              data={row.original}
              dataset={{
                salaryGrades,
                civilServantRanks,
                publicEmployeeRanks,
              }}
              form={UpdateSalaryForm}
              name="quá trình lương"
              fieldConfig={{}}
            />
            <DeleteSalariesDialog
              name="quá trình đào tạo chuyên môn"
              open={showDeleteSalaryDialog}
              onOpenChange={setShowDeleteSalaryDialog}
              salaries={[row.original]}
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
                  onSelect={() => setShowUpdateSalarySheet(true)}
                >
                  Sửa
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={() => setShowDeleteSalaryDialog(true)}
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
