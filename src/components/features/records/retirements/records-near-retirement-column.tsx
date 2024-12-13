import type { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import React from 'react';

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Cake,
  CalendarCheck,
  Dna,
  ScanBarcode,
  TypeOutline,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
      accessorKey: 'code',
      meta: {
        label: 'Mã cán bộ',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <ScanBarcode className="mr-2 size-5 text-muted-foreground" />
          <DataTableColumnHeader column={column} title="Mã hồ sơ" />
        </div>
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as React.ReactNode}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'fullName',
      meta: {
        label: 'Họ và tên',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <TypeOutline className="mr-2 size-5 text-pink-500" />
          <DataTableColumnHeader column={column} title="Họ và tên" />
        </div>
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as React.ReactNode}</div>
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
        <div className="flex flex-row items-center gap-1 ">
          <Dna className="mr-2 size-5 text-pink-900" />
          <DataTableColumnHeader column={column} title="Giới tính" />
        </div>
      ),
      cell: ({ row }) => (
        <Badge
          roundedType="md"
          variant="outline"
          className={cn(
            ' text-white',
            row.getValue('gender') === 'Nam' ? 'bg-indigo-500' : 'bg-pink-500',
          )}
        >
          {row.getValue('gender') || 'Chưa cập nhật'}
        </Badge>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'birthday',
      meta: {
        label: 'Ngày sinh',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <Cake className="mr-2 size-5 text-red-500" />
          <DataTableColumnHeader column={column} title="Ngày sinh" />
        </div>
      ),
      cell: ({ cell }) => (
        <div className="w-full">
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
    {
      accessorKey: 'birthday',
      meta: {
        label: 'Ngày nghỉ hưu dự kiến',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <CalendarCheck className="mr-2 size-5 text-blue-500" />
          <DataTableColumnHeader
            column={column}
            title="Ngày nghỉ hưu dự kiến"
          />
        </div>
      ),
      cell: ({ cell, row }) => (
        <div className="w-20">
          {
            dayjs(cell.getValue() as string)
              .add(row.getValue('gender') === 'Nam' ? 61 : 56, 'years')
              .format('D-MM-YYYY') as React.ReactNode
          }
        </div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
  ];
}
