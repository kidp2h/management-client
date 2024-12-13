import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';

import { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import React from 'react';

export const getColumns = (): ColumnDef<any>[] => {
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
    //   enableHiding: false,
    // },
    {
      accessorKey: 'record.fullName',
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
      accessorKey: 'previousSalaryGrade.name',
      meta: {
        label: 'Bậc lương trước khi nâng',
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Bậc lương trước khi nâng"
        />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'previousSalaryFactor',
      meta: {
        label: 'Hệ số trước khi nâng',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Hệ số trước khi nâng" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'preOverAllowance',
      meta: {
        label: 'PCVK trước khi nâng',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="PCVK trước khi nâng" />
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
        label: 'Bậc lương sau khi nâng',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Bậc lương sau khi nâng" />
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
        label: 'Hệ số sau khi nâng',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Hệ số sau khi nâng" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'overAllowance',
      meta: {
        label: 'PCVK sau khi nâng',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="PCVK sau khi nâng" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'createdAt',
      meta: {
        label: 'Thời điểm nâng lương',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Thời điểm nâng lương" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">
          {dayjs(cell.getValue() as Date)?.format('D-MM-YYYY')}
        </div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    // {
    //   accessorKey: 'civilServantRank.code',
    //   meta: {
    //     label: 'Mã ngạch',
    //   },
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Mã ngạch" />
    //   ),
    //   cell: ({ cell }) => (
    //     <div className="w-full">{cell.getValue() as string}</div>
    //   ),
    //   enableSorting: false,
    //   enableHiding: true,
    // },
    // {
    //   accessorKey: 'civilServantRank.name',
    //   meta: {
    //     label: 'Ngạch',
    //   },
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Ngạch" />
    //   ),
    //   cell: ({ cell }) => (
    //     <div className="w-full">{cell.getValue() as string}</div>
    //   ),
    //   enableSorting: false,
    //   enableHiding: true,
    // },
    // {
    //   accessorKey: 'salaryGrade.name',
    //   meta: {
    //     label: 'Bậc',
    //   },
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Bậc" />
    //   ),
    //   cell: ({ cell }) => (
    //     <div className="w-full">{cell.getValue() as string}</div>
    //   ),
    //   enableSorting: false,
    //   enableHiding: true,
    // },
  ];
};
