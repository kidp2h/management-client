'use client';

import type { Row } from '@tanstack/react-table';
import { BookA, Building } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

import { Icons } from '@/components/common/icons';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/date-picker';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  CreateMobilizationRecordSchema,
  mobilizationRecordSchema,
} from '@/lib/zod/schemas/record-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { getAllDepartments } from '@/db/queries/departments';
import { Combobox } from '@/components/ui/combobox';
import { flat } from '@/lib/utils';
import { createMobilization } from '@/db/actions/mobilizations';

interface MobilizationRecordDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  row: Row<any>['original'];
  departments: ReturnType<typeof getAllDepartments>;
  currentDepartment: Record<string, any>;
  onSuccess?: () => void;
}

export function MobilizationRecordDialog({
  row,
  onSuccess,
  departments,
  currentDepartment,
  ...props
}: MobilizationRecordDialogProps) {
  const [isPending, startTransition] = React.useTransition();
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const form = useForm<z.infer<typeof mobilizationRecordSchema>>({
    resolver: zodResolver(mobilizationRecordSchema),
    defaultValues: {
      fromDepartment: currentDepartment.id,
    },
  });
  const { data } = React.use(departments);
  function onSubmit(values: CreateMobilizationRecordSchema) {
    startTransition(async () => {
      const { error } = await createMobilization({
        recordId: row.record.id,
        ...values,
      });
      if (!error) {
        toast.success('Điều động thành công');
      } else {
        toast.error(
          'Hồ sơ này đã được điều động sang đơn vị khác, vui lòng chờ duyệt',
        );
      }
      props.onOpenChange?.(false);
      onSuccess?.();
    });
  }
  const formComponent = (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div>
          Chuyển từ đơn vị{' '}
          <span className="font-bold">{currentDepartment?.name}</span>
        </div>
        <FormField
          control={form.control}
          name="department"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Đơn vị chuyển đến</FormLabel>
              <Combobox
                startIcon={Building}
                type="form"
                form={form}
                placeholder="Đơn vị chuyển đến"
                field={field}
                className="w-full"
                dataset={
                  flat(data || [])
                    ?.map(d => ({
                      label: d.name,
                      value: d.id,
                    }))
                    .filter(d => d.value !== currentDepartment.id) || []
                }
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateMobilizate"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Ngày chuyển</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                  placeholder="Ngày chuyển"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="decisionNumber"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Số quyết định</FormLabel>
              <FormControl>
                <Input
                  startIcon={BookA}
                  type="text"
                  placeholder="Số quyết định"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateDecision"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Ngày quyết định</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                  placeholder="Ngày quyết định"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending && (
            <Icons.spinner
              className="mr-2 size-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Xác nhận
        </Button>
      </form>
    </Form>
  );
  if (isDesktop) {
    return (
      <Dialog {...props}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bạn có chắc chắn không?</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          {formComponent}
          <DialogFooter className="gap-2 sm:space-x-0">
            <DialogClose asChild>
              <Button variant="outline" className="w-full">
                Huỷ
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer {...props}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Bạn có chắc chắn không?</DrawerTitle>
          <DrawerDescription>
            Hành động này không thể hoàn tác.
          </DrawerDescription>
        </DrawerHeader>
        {formComponent}
        <DrawerFooter className="gap-2 sm:space-x-0">
          <DrawerClose asChild>
            <Button variant="outline">Huỷ</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
