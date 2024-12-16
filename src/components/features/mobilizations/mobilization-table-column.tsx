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
import dayjs from 'dayjs';
import React from 'react';
import { CancelMobilizationDialog } from './cancel-mobilization-dialog';
import { AcceptMobilizationDialog } from './accept-mobilization-dialog';
import { getAllFormSalary } from '@/db/queries/form-salary';
import { getAllCivilServantRanks } from '@/db/queries/civil-servant-ranks';
import { getAllSalaryGrades } from '@/db/queries/salary-grades';
import { getAllDuties } from '@/db/queries/duties';

export function getColumns(
  tab: string,
  formSalary: ReturnType<typeof getAllFormSalary>,
  civilServantRanks: ReturnType<typeof getAllCivilServantRanks>,
  salaryGrades: ReturnType<typeof getAllSalaryGrades>,
  duties: ReturnType<typeof getAllDuties>,
  childOfDepartments: any[],
): ColumnDef<any>[] {
  // console.log(provinces);
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
      enableHiding: true,
    },
    {
      accessorKey: 'record.code',
      meta: {
        label: 'Mã hồ sơ',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <DataTableColumnHeader column={column} title="Mã hồ sơ" />
        </div>
      ),
      cell: ({ row, cell }) => (
        <div className="w-full font-mono">
          {/* <pre>{JSON.stringify(row.original, null, 2)}</pre> */}
          {cell.getValue() as string}
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
        <div className="flex flex-row items-center gap-1 ">
          <DataTableColumnHeader column={column} title="Họ và tên" />
        </div>
      ),
      cell: ({ row, cell }) => (
        <div className="w-full">
          {/* <pre>{JSON.stringify(row.original, null, 2)}</pre> */}
          {cell.getValue() as string}
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
        <div className="flex flex-row items-center gap-1 ">
          <DataTableColumnHeader column={column} title="Số quyết định" />
        </div>
      ),
      cell: ({ row, cell }) => (
        <div className="w-full">
          {/* <pre>{JSON.stringify(row.original, null, 2)}</pre> */}
          {cell.getValue() as string}
        </div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'dateDecision',
      meta: {
        label: 'Ngày quyết định',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <DataTableColumnHeader column={column} title="Ngày quyết định" />
        </div>
      ),
      cell: ({ row, cell }) => (
        <div className="w-full">
          {/* <pre>{JSON.stringify(row.original, null, 2)}</pre> */}
          {dayjs(cell.getValue() as Date).format('D-MM-YYYY')}
        </div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'dateMobilizate',
      meta: {
        label: 'Ngày chuyển',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <DataTableColumnHeader column={column} title="Ngày chuyển" />
        </div>
      ),
      cell: ({ row, cell }) => (
        <div className="w-full">
          {/* <pre>{JSON.stringify(row.original, null, 2)}</pre> */}
          {dayjs(cell.getValue() as Date).format('D-MM-YYYY')}
        </div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'fromDepartment.name',
      meta: {
        label: 'Từ đơn vị',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <DataTableColumnHeader column={column} title="Từ đơn vị" />
        </div>
      ),
      cell: ({ row, cell }) => (
        <div className="w-full">
          {/* <pre>{JSON.stringify(row.original, null, 2)}</pre> */}
          {cell.getValue() as string}
        </div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'department.name',
      meta: {
        label: 'Đến đơn vị',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <DataTableColumnHeader column={column} title="Đến đơn vị" />
        </div>
      ),
      cell: ({ row, cell }) => (
        <div className="w-full">
          {/* <pre>{JSON.stringify(row.original, null, 2)}</pre> */}
          {cell.getValue() as string}
        </div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        const [showCancelDialog, setShowCancleDialog] = React.useState(false);
        const [showAcceptDialog, setShowAcceptDialog] = React.useState(false);

        React.useEffect(() => {});

        const [isUpdatePending, startUpdateTransition] = React.useTransition();

        return (
          <>
            {/* <MobilizationRecordDialog
              row={row.original}
              currentDepartment={cDepartment}
              open={showMobilizationRecordDialog}
              onOpenChange={setShowMobilizationRecordDialog}
              departments={departments}
              onSuccess={() => row.toggleSelected(false)}
            />
            <DeleteRecordsDialog
              name="hồ sơ"
              open={showDeleteRecordDialog}
              onOpenChange={setShowDeleteRecordDialog}
              records={[row.original]}
              showTrigger={false}
              onSuccess={() => row.toggleSelected(false)}
            /> */}
            <AcceptMobilizationDialog
              open={showAcceptDialog}
              onOpenChange={setShowAcceptDialog}
              row={row.original}
              formSalary={formSalary}
              duties={duties}
              childOfDepartments={childOfDepartments}
              civilServantRanks={civilServantRanks}
              salaryGrades={salaryGrades}
              onSuccess={() => row.toggleSelected(false)}
            />
            <CancelMobilizationDialog
              open={showCancelDialog}
              onOpenChange={setShowCancleDialog}
              row={row.original}
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

                {tab === 'mobilizating' && (
                  <DropdownMenuItem onSelect={() => setShowAcceptDialog(true)}>
                    Tiếp nhận
                  </DropdownMenuItem>
                )}
                {tab === 'mobilizated' && (
                  <DropdownMenuItem onSelect={() => setShowCancleDialog(true)}>
                    Huỷ điều động
                    {/* <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut> */}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
      size: 40,
    },
  ];
}
