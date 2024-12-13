import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { IncreaseSalaryRegularDialog } from './increase-salary-regular-dialog';
import { getAllSalaryGrades } from '@/db/queries/salary-grades';

export const getColumns = (
  salaryGrades: ReturnType<typeof getAllSalaryGrades>,
  cDepartment: any,
): ColumnDef<any>[] => {
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
      accessorKey: 'fullName',
      meta: {
        label: 'Họ và tên',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Họ và tên" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'gender',
      meta: {
        label: 'Giới tính',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Giới tính" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'civilServantRank.code',
      meta: {
        label: 'Mã ngạch',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mã ngạch" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'civilServantRank.name',
      meta: {
        label: 'Ngạch',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngạch" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'salaryGrade.name',
      meta: {
        label: 'Bậc',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Bậc" />
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
        const [showCancelDialog, setShowCancleDialog] = React.useState(false);
        const [showIncreaseDialog, setShowIncreaseDialog] =
          React.useState(false);

        React.useEffect(() => {});

        const [isUpdatePending, startUpdateTransition] = React.useTransition();

        return (
          <>
            <IncreaseSalaryRegularDialog
              open={showIncreaseDialog}
              onOpenChange={setShowIncreaseDialog}
              salaryGrades={salaryGrades}
              row={row.original}
              cDepartment={cDepartment}
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
                <DropdownMenuLabel className="text-xs font-bold uppercase text-muted-foreground">
                  Thao tác
                </DropdownMenuLabel>

                <DropdownMenuItem onSelect={() => setShowIncreaseDialog(true)}>
                  Nâng lương
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
      size: 40,
    },
  ];
};
