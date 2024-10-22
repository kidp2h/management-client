'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
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
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import { FormControl } from './form';

export interface ComboboxPropsBase {
  dataset: { label: string; value: string }[];
  placeholder: string;
  className?: string;
}

export interface ComboboxNormalProps extends ComboboxPropsBase {
  type: 'normal';
}
export interface ComboboxFormProps extends ComboboxPropsBase {
  type: 'form';
  field: ControllerRenderProps<any>;
  form: UseFormReturn<any>;
  setValue?: (value: any) => void;
}

type ComboboxProps = ComboboxNormalProps | ComboboxFormProps;

export function Combobox(props: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');

  return (
    <div className={props.className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {props.type === 'form' ? (
            <FormControl>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between overflow-hidden"
              >
                {props.field?.value
                  ? props.dataset.find(data => data.value === props.field.value)
                      ?.label
                  : props.placeholder}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </FormControl>
          ) : (
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between flex overflow-hidden"
            >
              {value
                ? props.dataset.find(data => data.value === value)?.label
                : props.placeholder}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={props.placeholder} />
            <CommandList>
              <CommandEmpty>Không có dữ liệu</CommandEmpty>
              <CommandGroup>
                {props.dataset.map(data => (
                  <CommandItem
                    key={data.value}
                    value={data.value}
                    onSelect={currentValue => {
                      if (props.type === 'form') {
                        props.form.setValue(props.field.name, data.value);
                        props.setValue?.(data.value);
                      } else {
                        setValue(currentValue === value ? '' : currentValue);
                        setOpen(false);
                      }
                    }}
                  >
                    {props.type === 'form' ? (
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          data.value === props.field.value
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                    ) : (
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          value === data.value ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                    )}

                    {data.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
