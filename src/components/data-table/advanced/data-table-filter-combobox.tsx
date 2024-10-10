'use client';

import {
  CaretSortIcon,
  ChevronDownIcon,
  TextIcon,
} from '@radix-ui/react-icons';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { DataTableFilterOption } from '@/types';

interface DataTableFilterComboboxProps<TData> {
  options: DataTableFilterOption<TData>[];
  selectedOptions: DataTableFilterOption<TData>[];
  setSelectedOptions: React.Dispatch<
    React.SetStateAction<DataTableFilterOption<TData>[]>
  >;
  onSelect: () => void;
  children?: React.ReactNode;
}

export function DataTableFilterCombobox<TData>({
  options,
  selectedOptions,
  setSelectedOptions,
  onSelect,
  children,
}: DataTableFilterComboboxProps<TData>) {
  const [value, setValue] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [, setSelectedOption] = React.useState<DataTableFilterOption<TData>>(
    options[0] ?? ({} as DataTableFilterOption<TData>),
  );
  console.log('H');

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {children ?? (
          <Button
            variant="outline"
            size="sm"
            role="combobox"
            className="h-12 capitalize"
          >
            <CaretSortIcon
              className="mr-2 size-4 shrink-0"
              aria-hidden="true"
            />
            Lọc
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-[12.5rem] p-0" align="end">
        <Command>
          <CommandInput placeholder="Lọc bởi..." />
          <CommandList>
            <CommandEmpty>Không tìm thấy.</CommandEmpty>
            <CommandGroup>
              {options
                .filter(
                  option =>
                    !selectedOptions.some(
                      selectedOption => selectedOption.key === option.value,
                    ),
                )
                .map(option => (
                  <CommandItem
                    key={String(option.value)}
                    className="capitalize"
                    value={String(option.label)}
                    onSelect={currentValue => {
                      setValue(currentValue === value ? '' : currentValue);
                      setOpen(false);
                      setSelectedOption(option);
                      setSelectedOptions(prev => {
                        return [...prev, { ...option }];
                      });
                      onSelect();
                    }}
                  >
                    {option.options.length > 0 ? (
                      <ChevronDownIcon
                        className="mr-2 size-4"
                        aria-hidden="true"
                      />
                    ) : (
                      <TextIcon className="mr-2 size-4" aria-hidden="true" />
                    )}
                    {option.label}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
