'use client';

import { PlusIcon } from '@radix-ui/react-icons';
import type { Table } from '@tanstack/react-table';
import { useSearchParams } from 'next/navigation';
import * as React from 'react';

import { DataTableFilterCombobox } from '@/components/data-table/advanced/data-table-filter-combobox';
import { DataTableViewOptions } from '@/components/data-table/data-table-view-options';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { DataTableFilterField, DataTableFilterOption } from '@/types';

import { DataTableFilterItem } from './data-table-filter-item';
import { DataTableMultiFilter } from './data-table-multi-filter';

interface DataTableAdvancedToolbarProps<TData>
  extends React.HTMLAttributes<HTMLDivElement> {
  table: Table<TData>;
  filterFields?: DataTableFilterField<TData>[];
  btnView?: boolean;
}

export function DataTableAdvancedToolbar<TData>({
  table,
  filterFields = [],
  children,
  className,
  btnView = true,
  ...props
}: DataTableAdvancedToolbarProps<TData>) {
  const searchParams = useSearchParams();

  const options = React.useMemo<DataTableFilterOption<TData>[]>(() => {
    return filterFields.map(field => {
      return {
        id: crypto.randomUUID(),
        label: field.label,
        value: field.value,
        key: field.key,
        description: field.description,
        options: field.options ?? [],
      };
    });
  }, [filterFields]);

  const initialSelectedOptions = React.useMemo(() => {
    return options
      .filter(option => searchParams.has(option.value as string))
      .map(option => {
        const value = searchParams.get(String(option.value)) as string;
        const [filterValue, filterOperator] =
          value?.split('~').filter(Boolean) ?? [];

        return {
          ...option,
          filterValues: filterValue?.split('~') ?? [],
          filterOperator,
        };
      });
  }, [options, searchParams]);

  const [selectedOptions, setSelectedOptions] = React.useState<
    DataTableFilterOption<TData>[]
  >(initialSelectedOptions);
  const [openFilterBuilder, setOpenFilterBuilder] = React.useState<boolean>(
    initialSelectedOptions.length > 0 || true,
  );
  const [openCombobox, setOpenCombobox] = React.useState(true);

  function onFilterComboboxItemSelect() {
    setOpenFilterBuilder(true);
    setOpenCombobox(true);
  }

  return (
    <div
      className={cn(
        'flex w-full flex-row-reverse gap-2  items-center space-2.5 overflow-auto py-1',
        className,
      )}
      {...props}
    >
      <div className="ml-auto flex items-center gap-2">
        {children}
        {(options.length > 0 && selectedOptions.length > 0) || openFilterBuilder
          ? null // </Button> //   Lọc //   /> //     aria-hidden="true" //     className="mr-2 size-4 shrink-0" //   <CaretSortIcon // > //   onClick={() => setOpenFilterBuilder(!openFilterBuilder)} //   size="sm" //   variant="outline" // <Button
          : null}
        {btnView && <DataTableViewOptions table={table} />}
      </div>
      <div className={cn('flex items-center gap-2')}>
        {selectedOptions
          .filter(option => !option.isMulti)
          .map(selectedOption => (
            <div key={String(selectedOption.value)}>
              <DataTableFilterItem
                key={String(selectedOption.value)}
                table={table}
                selectedOption={selectedOption}
                selectedOptions={selectedOptions}
                setSelectedOptions={setSelectedOptions}
                defaultOpen={openCombobox}
              />
            </div>
          ))}
        {selectedOptions.some(option => option.isMulti) ? (
          <DataTableMultiFilter
            table={table}
            allOptions={options}
            options={selectedOptions.filter(option => option.isMulti)}
            setSelectedOptions={setSelectedOptions}
            defaultOpen={openCombobox}
          />
        ) : null}
        {options.length > 0 && options.length > selectedOptions.length ? (
          <DataTableFilterCombobox
            options={options}
            selectedOptions={selectedOptions}
            setSelectedOptions={setSelectedOptions}
            onSelect={onFilterComboboxItemSelect}
          >
            <Button
              variant="outline"
              size="sm"
              role="combobox"
              className="h-7 rounded-full"
              onClick={() => setOpenCombobox(true)}
            >
              <PlusIcon className="mr-2 size-4 opacity-50" aria-hidden="true" />
              Lọc
            </Button>
          </DataTableFilterCombobox>
        ) : null}
      </div>
    </div>
  );
}
