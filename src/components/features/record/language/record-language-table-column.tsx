import type { ColumnDef } from '@tanstack/react-table';
import React from 'react';

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Checkbox } from '@/components/ui/checkbox';
import { getAllLanguages } from '@/db/queries/languages';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { DeleteLanguagesDialog } from './delete-languages-dialog';
import UpdateLanguageForm from './update-language-form';
import { UpdateDataSheet } from '@/components/common/update-data-sheet';

export function getColumns(
  languages: ReturnType<typeof getAllLanguages>,
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
      accessorKey: 'language.name',
      meta: {
        label: 'Ngôn ngữ',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ngôn ngữ" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as React.ReactNode}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'mark',
      meta: {
        label: 'Điểm/Bậc',
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Điểm/Bậc" />
      ),
      cell: ({ cell }) => (
        <div className="w-full">{cell.getValue() as React.ReactNode}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        const [showUpdateLanguageSheet, setShowUpdateLanguageSheet] =
          React.useState(false);
        const [showDeleteLanguageDialog, setShowDeleteLanguageDialog] =
          React.useState(false);
        React.useEffect(() => {
          // document.body.classList.remove('pointer-events-none');
        });
        const { data: dataLanguages } = React.use(languages);
        return (
          <>
            <UpdateDataSheet
              open={showUpdateLanguageSheet}
              onOpenChange={setShowUpdateLanguageSheet}
              data={row.original}
              form={UpdateLanguageForm}
              dataset={{
                languages: dataLanguages,
              }}
              name="ngoại ngữ"
              fieldConfig={{}}
            />
            <DeleteLanguagesDialog
              name="ngoại ngữ"
              open={showDeleteLanguageDialog}
              onOpenChange={setShowDeleteLanguageDialog}
              languages={[row.original]}
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
                  onSelect={() => setShowUpdateLanguageSheet(true)}
                >
                  Sửa
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={() => setShowDeleteLanguageDialog(true)}
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
