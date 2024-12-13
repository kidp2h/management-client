'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Home, LucideIcon } from 'lucide-react';
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
import { Skeleton } from './skeleton';

export interface ComboboxPropsBase {
  dataset: { label: string; value: string }[];
  placeholder: string;
  className?: string;
  disabled?: boolean;
  chunkSize?: number;
  startIcon?: LucideIcon;
  lazy?: boolean;
}

export interface ComboboxNormalProps extends ComboboxPropsBase {
  type: 'normal';
  value: string;
  setValue: (value: string) => void;
}

export interface ComboboxFormProps extends ComboboxPropsBase {
  type: 'form';
  field: ControllerRenderProps<any>;
  form: UseFormReturn<any>;
  setValue?: (value: any) => void;
  callback?: (label?: string) => void;
}

type ComboboxProps = ComboboxNormalProps | ComboboxFormProps;

export function Combobox(props: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [visibleData, setVisibleData] = React.useState<typeof props.dataset>(
    [],
  );
  const StartIcon = props.startIcon;
  const [currentChunk, setCurrentChunk] = React.useState(1);
  const observerTarget = React.useRef<HTMLDivElement>(null);
  const chunkSize = props.chunkSize || 20;

  // Initialize with first chunk
  React.useEffect(() => {
    if (!props.lazy) {
      setVisibleData(props.dataset);
    } else {
      setVisibleData(props.dataset.slice(0, chunkSize));
    }
  }, [props.dataset, chunkSize]);

  const loadMoreItems = React.useCallback(() => {
    const nextChunk = currentChunk + 1;
    const start = currentChunk * chunkSize;
    const end = start + chunkSize;
    const newItems = props.dataset.slice(start, end);

    if (newItems.length > 0) {
      setVisibleData(prev => [...prev, ...newItems]);
      setCurrentChunk(nextChunk);
    }
  }, [currentChunk, props.dataset, chunkSize]);

  const handleScroll = React.useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && visibleData.length < props.dataset.length) {
        // console.log('Load more items');
        loadMoreItems();
      }
    },
    [loadMoreItems, visibleData.length, props.dataset.length],
  );

  React.useEffect(() => {
    const observer = new IntersectionObserver(handleScroll, {
      root: null,
      rootMargin: '0px',
      threshold: 1.0,
    });

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    // return () => observer.disconnect();
  }, [handleScroll]);
  const hasMore = visibleData.length < props.dataset.length;
  const groupMemo = (
    <>
      {visibleData.map(data => (
        <CommandItem
          key={data.value}
          value={data.value}
          onSelect={currentValue => {
            if (props.type === 'form') {
              props.form.setValue(props.field.name, data.value, {
                shouldDirty: true,
              });

              props?.callback?.(data.label);
            } else {
              setValue(currentValue === value ? '' : currentValue);
            }
            props?.setValue?.(data.value);
            setOpen(false);
          }}
        >
          {props.type === 'form' ? (
            <Check
              className={cn(
                'mr-2 h-4 w-4',
                data.value === props.field.value ? 'opacity-100' : 'opacity-0',
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

      <div ref={observerTarget} />
    </>
  );

  return (
    <div className={props.className}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={props.disabled}>
          {props.type === 'form' ? (
            <FormControl>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between overflow-hidden"
              >
                <div className="flex flex-row items-center gap-1">
                  <div>
                    {StartIcon && <StartIcon className="mr-2" size={18} />}
                  </div>
                  <div>
                    {props.field?.value
                      ? props.dataset.find(
                          data => data.value === props.field.value,
                        )?.label
                      : props.placeholder}
                  </div>
                </div>

                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0  opacity-50" />
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
          <Command
            filter={(value, search) => {
              const item = props.dataset.find(item => item.value === value);
              if (!item) return 0;
              if (item.label.toLowerCase().includes(search.toLowerCase()))
                return 1;

              return 0;
            }}
          >
            <CommandInput placeholder={props.placeholder} />
            <CommandList>
              <CommandEmpty>Không có dữ liệu</CommandEmpty>
              <CommandGroup>{groupMemo}</CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
