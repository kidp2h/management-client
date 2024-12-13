'use client';

import { Plus } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { useMediaQuery } from '@/hooks/use-media-query';
import { ScrollArea } from '../ui/scroll-area';

export interface FormDialogProps {
  form: ({ onSuccess }: any) => JSX.Element;
  name?: string;
  description: string;
  disabled?: boolean;
  showTrigger?: boolean;
  data?: any;
  _open?: boolean;
  title: string;
  _onOpenChange?: (open: boolean) => void;
}
export function FormDialog({
  form: FormCreate,
  name,
  data,
  disabled,
  showTrigger = true,
  description,
  _open,
  title,
  _onOpenChange,
}: FormDialogProps) {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery('(min-width: 640px)');

  if (isDesktop)
    return (
      <Dialog open={_open || open} onOpenChange={_onOpenChange || setOpen}>
        {showTrigger && (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" disabled={disabled}>
              <Plus className="mr-2 size-4" aria-hidden="true" />
              Thêm mới {name}
            </Button>
          </DialogTrigger>
        )}

        <DialogContent className="max-h-[95vh] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <FormCreate
            {...data}
            onSuccess={() => {
              setOpen(false);
            }}
          />
          <DialogFooter className="w-full">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="w-full">
                Huỷ
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {showTrigger && (
        <DrawerTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 size-4" aria-hidden="true" />
            ...
          </Button>
        </DrawerTrigger>
      )}

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="p-3 max-h-[60vh] overflow-auto">
          <FormCreate
            {...data}
            onSuccess={() => {
              setOpen(false);
            }}
          />
        </ScrollArea>

        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">Huỷ</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
