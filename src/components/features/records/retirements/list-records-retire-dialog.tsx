'use client';

import { Plus } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import { Icons } from '@/components/common/icons';
import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { Badge } from '@/components/ui/badge';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { listRecordsRetire } from '@/db/actions/records';
import { useMediaQuery } from '@/hooks/use-media-query';
import { listRecordsRetireSchema } from '@/lib/zod/schemas/record-schema';

export interface ListRecordsRetireDialogProps {
  records: any;
  onSuccess?: () => void;
}
export function ListRecordsRetireDialog({
  records,
  onSuccess,
}: ListRecordsRetireDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const isDesktop = useMediaQuery('(min-width: 640px)');
  function onList(values: z.infer<typeof listRecordsRetireSchema>) {
    startTransition(async () => {
      const { error } = await listRecordsRetire({
        ids: records.map((record: any) => record.id),
        ...values,
      });
      if (error) {
        toast.error(error);
        return;
      }
      toast.success('Danh sách đã được lập');
      onSuccess?.();
    });
  }
  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 size-4" aria-hidden="true" />
            Lập danh sách nghỉ hưu
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[95vh] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>Lập danh sách</DialogTitle>
            <DialogDescription>Lập danh sách nghỉ hưu</DialogDescription>
          </DialogHeader>
          <p className="font-bold uppercase">
            Danh sách hồ sơ được lập danh sách nghỉ hưu:
          </p>
          <div className="flex flex-row flex-wrap gap-2">
            {records.map((record: any) => (
              <Badge className="w-fit" key={record.id}>
                {record.fullName}
              </Badge>
            ))}
          </div>
          <Separator className="my-2" />
          <AutoForm formSchema={listRecordsRetireSchema} onSubmit={onList}>
            <AutoFormSubmit className="w-full" disabled={isPending}>
              {isPending && (
                <Icons.spinner
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Lập danh sách
            </AutoFormSubmit>
          </AutoForm>
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
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 size-4" aria-hidden="true" />
          Lập danh sách nghỉ hưu
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Lập danh sách</DrawerTitle>
          <DrawerDescription>Lập danh sách nghỉ hưu</DrawerDescription>
        </DrawerHeader>
        <ScrollArea className="max-h-[60vh] overflow-auto p-3">
          <AutoForm formSchema={listRecordsRetireSchema}>
            <AutoFormSubmit className="w-full" disabled={isPending}>
              {isPending && (
                <Icons.spinner
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Lập danh sách
            </AutoFormSubmit>
          </AutoForm>
        </ScrollArea>

        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Huỷ
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
