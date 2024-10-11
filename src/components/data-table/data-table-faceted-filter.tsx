import { CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons';
import type { Column } from '@tanstack/react-table';
import dayjs from 'dayjs';
import React from 'react';
import type { DateRange } from 'react-day-picker';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { Option } from '@/types';

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: Option[];
  isDate?: boolean;
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
  isDate,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const selectedValues = new Set(column?.getFilterValue() as string[]);
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: undefined,
  });
  return (
    <Popover>
      <PopoverTrigger asChild className="transition-all">
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircledIcon className="mr-2 size-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} được chọn
                  </Badge>
                ) : isDate ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {dayjs(dateRange?.from).format('DD/MM/YYYY')} -{' '}
                    {dayjs(dateRange?.to).format('DD/MM/YYYY')}
                  </Badge>
                ) : (
                  options
                    .filter(option => selectedValues.has(option.value))
                    .map(option => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 " align={isDate ? 'end' : 'start'}>
        {isDate ? (
          <div className="flex flex-col items-center justify-center">
            <Calendar
              mode="range"
              initialFocus
              captionLayout="dropdown-buttons"
              defaultMonth={dateRange?.from}
              selected={dateRange}
              fromYear={1930}
              toYear={new Date().getFullYear() + 2}
              numberOfMonths={2}
              onSelect={value => {
                if (value) {
                  const { from, to } = value;
                  if (from && to) {
                    column?.setFilterValue([
                      new Date(from!).toISOString(),
                      new Date(to!).toISOString(),
                    ]);
                    setDateRange({ from: new Date(from!), to: new Date(to!) });
                  }
                }
              }}
            />
            <Button
              onClick={() => {
                column?.setFilterValue(undefined);
                setDateRange({
                  from: new Date(),
                  to: undefined,
                });
              }}
              variant="ghost"
              className="my-2 justify-center text-center"
            >
              Xoá lọc
            </Button>
          </div>
        ) : (
          <Command>
            <CommandInput placeholder={title} />
            <CommandList>
              <CommandEmpty>Không tìm thấy.</CommandEmpty>
              <CommandGroup className="max-h-[18.75rem] overflow-y-auto overflow-x-hidden">
                {options.map(option => {
                  const isSelected = selectedValues.has(option.value);

                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => {
                        if (isSelected) selectedValues.delete(option.value);
                        if (option.isBoolean) {
                          if (isSelected) selectedValues.delete(option.value);
                          else {
                            selectedValues.clear();
                            selectedValues.add(option.value);
                          }
                        } else {
                          selectedValues.add(option.value);
                        }
                        const filterValues = Array.from(selectedValues);
                        column?.setFilterValue(
                          filterValues.length ? filterValues : undefined,
                        );
                      }}
                    >
                      <div
                        className={cn(
                          'mr-2 flex size-4 items-center justify-center rounded-sm border border-primary',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible',
                        )}
                      >
                        <CheckIcon className="size-4" aria-hidden="true" />
                      </div>
                      {option.icon && (
                        <option.icon
                          className="mr-2 size-4 text-muted-foreground"
                          aria-hidden="true"
                        />
                      )}
                      <span>{option.label}</span>
                      {option.withCount &&
                        column?.getFacetedUniqueValues()?.get(option.value) && (
                          <span className="ml-auto flex size-4 items-center justify-center font-mono text-xs">
                            {column?.getFacetedUniqueValues().get(option.value)}
                          </span>
                        )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {selectedValues.size > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => column?.setFilterValue(undefined)}
                      className="justify-center text-center"
                    >
                      Xoá lọc
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
}
