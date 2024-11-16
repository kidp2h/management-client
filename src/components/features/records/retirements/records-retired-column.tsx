import type { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import React from 'react';

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';

export function getColumns(): ColumnDef<any>[] {
  return [
    {
      accessorKey: 'record.code',
      meta: {
        label: 'Mã cán bộ',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Mã cán bộ" />
      ),
      cell: ({ cell }) => (
        <div className="w-20">{cell.getValue() as React.ReactNode}</div>
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
        <div className="w-20">{cell.getValue() as React.ReactNode}</div>
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
        <div className="w-20">{cell.getValue() as React.ReactNode}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'retiredDate',
      meta: {
        label: 'Ngày nghỉ hưu',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngày nghỉ hưu" />
      ),
      cell: ({ cell }) => (
        <div className="w-20">
          {
            dayjs(cell.getValue() as string).format(
              'D-MM-YYYY',
            ) as React.ReactNode
          }
        </div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
  ];
}
