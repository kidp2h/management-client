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
import { DeleteTrainingsDialog } from './delete-trainings-dialog';
import UpdateTrainingForm from './update-training-form';
import { getAllQualifications } from '@/db/queries/qualifications';
import { getAllFormTrainings } from '@/db/queries/form-trainings';

export function getColumns(
  qualifications: ReturnType<typeof getAllQualifications>,
  formTrainings: ReturnType<typeof getAllFormTrainings>,
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
      accessorKey: 'nameOfTrainingInstitution',
      meta: {
        label: 'Tên trường',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tên trường" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'majors',
      meta: {
        label: 'Ngành học hoặc tên lớp học',
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title="Ngành học hoặc tên lớp học"
        />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as string}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'from',
      meta: {
        label: 'Từ',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Từ" />
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
      accessorKey: 'to',
      meta: {
        label: 'Đến',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Đến" />
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
      accessorKey: 'formTraining.name',
      meta: {
        label: 'Hình thức học',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Hình thức học" />
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
    //   accessorKey: 'level',
    //   meta: {
    //     label: 'Loại',
    //   },
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Loại" />
    //   ),
    //   cell: ({ cell }) => (
    //     <div className="w-full">{cell.getValue() as string}</div>
    //   ),
    //   enableSorting: false,
    //   enableHiding: true,
    // },
    // {
    //   accessorKey: 'majors',
    //   meta: {
    //     label: 'Chuyên ngành',
    //   },
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title="Chuyên ngành" />
    //   ),
    //   cell: ({ cell }) => (
    //     <div className="w-full">{cell.getValue() as string}</div>
    //   ),
    //   enableSorting: false,
    //   enableHiding: true,
    // },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        const [showUpdateTrainingSheet, setShowUpdateTrainingSheet] =
          React.useState(false);
        const [showDeleteTrainingDialog, setShowDeleteTrainingDialog] =
          React.useState(false);
        React.useEffect(() => {
          // document.body.classList.remove('pointer-events-none');
        });
        const { data: dataQualifications } = React.use(qualifications);
        const { data: dataFormTrainings } = React.use(formTrainings);
        return (
          <>
            <UpdateDataSheet
              open={showUpdateTrainingSheet}
              onOpenChange={setShowUpdateTrainingSheet}
              data={row.original}
              form={UpdateTrainingForm}
              name="quá trình đào tạo chuyên môn"
              dataset={{
                qualifications: dataQualifications,
                formTrainings: dataFormTrainings,
              }}
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
            <DeleteTrainingsDialog
              name="quá trình đào tạo chuyên môn"
              open={showDeleteTrainingDialog}
              onOpenChange={setShowDeleteTrainingDialog}
              trainings={[row.original]}
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
                  onSelect={() => setShowUpdateTrainingSheet(true)}
                >
                  Sửa
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={() => setShowDeleteTrainingDialog(true)}
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
