import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';

import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import React from 'react';

export function getColumns(): ColumnDef<any>[] {
  // console.log(provinces);
  return [
    // {
    //   id: 'select',
    //   header: ({ table }) => (
    //     <Checkbox
    //       checked={
    //         table.getIsAllPageRowsSelected() ||
    //         (table.getIsSomePageRowsSelected() && 'indeterminate')
    //       }
    //       onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
    //       aria-label="Select all"
    //       className="translate-y-0.5 border-none bg-card-foreground"
    //     />
    //   ),
    //   cell: ({ row }) => (
    //     <Checkbox
    //       checked={row.getIsSelected()}
    //       onCheckedChange={value => row.toggleSelected(!!value)}
    //       aria-label="Select row"
    //       className="translate-y-0.5 border-none bg-card-foreground"
    //     />
    //   ),
    //   enableSorting: false,
    //   enableHiding: true,
    // },
    {
      accessorKey: 'record.fullName',
      meta: {
        label: 'Cán bộ',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cán bộ" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'yearStart',
      meta: {
        label: 'Ngày nhập học',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngày nhập học" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">
          {dayjs(cell.getValue() as Date).format('D-MM-YYYY')}
        </div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'yearEnd',
      meta: {
        label: 'Ngày tốt nghiệp',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngày tốt nghiệp" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">
          {dayjs(cell.getValue() as Date).format('D-MM-YYYY')}
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
        <DataTableColumnHeader column={column} title="Số quyết định" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
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
        <DataTableColumnHeader column={column} title="Ngày quyết định" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">
          {dayjs(cell.getValue() as Date).format('D-MM-YYYY')}
        </div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'departmentDecision',
      meta: {
        label: 'Cơ quan quyểt định',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Cơ quan quyểt định" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'funding',
      meta: {
        label: 'Nguồn kinh phí',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nguồn kinh phí" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'curriculum',
      meta: {
        label: 'Chương trình đào tạo',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Chương trình đào tạo" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'school',
      meta: {
        label: 'Trường đào tạo',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trường đào tạo" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'country',
      meta: {
        label: 'Nước đào tạo',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nước đào tạo" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'qualification.name',
      meta: {
        label: 'Trình độ',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Trình độ" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    // {
    //   id: 'actions',
    //   cell: function Cell({ row }) {
    //     const [showCancelDialog, setShowCancleDialog] = React.useState(false);
    //     const [showAcceptDialog, setShowAcceptDialog] = React.useState(false);

    //     React.useEffect(() => {});

    //     const [isUpdatePending, startUpdateTransition] = React.useTransition();

    //     return (
    //       <>
    //         {/* <MobilizationRecordDialog
    //           row={row.original}
    //           currentDepartment={cDepartment}
    //           open={showMobilizationRecordDialog}
    //           onOpenChange={setShowMobilizationRecordDialog}
    //           departments={departments}
    //           onSuccess={() => row.toggleSelected(false)}
    //         />
    //         <DeleteRecordsDialog
    //           name="hồ sơ"
    //           open={showDeleteRecordDialog}
    //           onOpenChange={setShowDeleteRecordDialog}
    //           records={[row.original]}
    //           showTrigger={false}
    //           onSuccess={() => row.toggleSelected(false)}
    //         /> */}
    //         <AcceptMobilizationDialog
    //           open={showAcceptDialog}
    //           onOpenChange={setShowAcceptDialog}
    //           row={row.original}
    //           formSalary={formSalary}
    //           duties={duties}
    //           childOfDepartments={childOfDepartments}
    //           civilServantRanks={civilServantRanks}
    //           salaryGrades={salaryGrades}
    //           onSuccess={() => row.toggleSelected(false)}
    //         />
    //         <CancelMobilizationDialog
    //           open={showCancelDialog}
    //           onOpenChange={setShowCancleDialog}
    //           row={row.original}
    //           onSuccess={() => row.toggleSelected(false)}
    //         />
    //         <DropdownMenu>
    //           <DropdownMenuTrigger asChild>
    //             <Button
    //               aria-label="Open menu"
    //               variant="ghost"
    //               className="flex size-8  p-0 "
    //             >
    //               <DotsHorizontalIcon className="size-4" aria-hidden="true" />
    //             </Button>
    //           </DropdownMenuTrigger>
    //           <DropdownMenuContent align="end" className="w-40">
    //             <DropdownMenuLabel className="text-xs font-bold uppercase text-muted-foreground">
    //               Thao tác
    //             </DropdownMenuLabel>

    //             {tab === 'mobilizating' && (
    //               <DropdownMenuItem onSelect={() => setShowAcceptDialog(true)}>
    //                 Tiếp nhận
    //               </DropdownMenuItem>
    //             )}
    //             {tab === 'mobilizated' && (
    //               <DropdownMenuItem onSelect={() => setShowCancleDialog(true)}>
    //                 Huỷ điều động
    //                 {/* <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut> */}
    //               </DropdownMenuItem>
    //             )}
    //           </DropdownMenuContent>
    //         </DropdownMenu>
    //       </>
    //     );
    //   },
    //   size: 40,
    // },
  ];
}
