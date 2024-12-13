'use client';

import type { Row } from '@tanstack/react-table';
import {
  BookA,
  BookType,
  Building,
  Globe,
  GraduationCap,
  HandCoins,
  University,
} from 'lucide-react';
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
import { nationalities } from '@/db/schema';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  CreateSendRecordSchema,
  sendRecordSchema,
} from '@/lib/zod/schemas/record-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Combobox } from '@/components/ui/combobox';
import { createSend } from '@/db/actions/sends';
import { getAllQualifications } from '@/db/queries/qualifications';

interface SendRecordDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  row: Row<any>['original'];
  qualifications: ReturnType<typeof getAllQualifications>;
  currentDepartment: Record<string, any>;
  onSuccess?: () => void;
}

export function SendRecordDialog({
  row,
  onSuccess,
  qualifications,
  currentDepartment,
  ...props
}: SendRecordDialogProps) {
  const [isPending, startTransition] = React.useTransition();
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const form = useForm<z.infer<typeof sendRecordSchema>>({
    resolver: zodResolver(sendRecordSchema),
    defaultValues: {},
  });
  const { data: dataQualifications } = React.use(qualifications);
  function onSubmit(values: CreateSendRecordSchema) {
    startTransition(async () => {
      const { error } = await createSend({
        recordId: row.record.id,
        ...values,
      });
      if (!error) {
        toast.success('Cử đi học thành công');
      } else {
        toast.error('Cử đi học không thành công. Vui lòng thử lại sau.');
      }
      props.onOpenChange?.(false);
      onSuccess?.();
    });
  }
  const formComponent = (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid grid-cols-2 gap-5"
      >
        <FormField
          control={form.control}
          name="yearStart"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Ngày nhập học</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                  placeholder="Ngày nhập học"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="yearEnd"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Ngày tốt nghiệp</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                  placeholder="Ngày tốt nghiệp"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="qualification"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Trình độ</FormLabel>
              <Combobox
                startIcon={GraduationCap}
                type="form"
                form={form}
                placeholder="Trình độ"
                field={field}
                className="w-full"
                dataset={
                  dataQualifications?.map(d => ({
                    label: d.name,
                    value: d.id,
                  })) || []
                }
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="funding"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Nguồn kinh phí</FormLabel>
              <Input
                startIcon={HandCoins}
                type="text"
                placeholder="Nguồn kinh phí"
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="curriculum"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Chương trình đào tạo</FormLabel>
              <Input
                startIcon={BookType}
                type="text"
                placeholder="Chương trình đào tạo"
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="school"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Trường đào tạo</FormLabel>
              <Input
                startIcon={University}
                type="text"
                placeholder="Trường đào tạo"
                {...field}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Nước đào tạo</FormLabel>
              <Combobox
                startIcon={Globe}
                type="form"
                form={form}
                placeholder="Nước đào tạo"
                field={field}
                className="w-full"
                dataset={
                  nationalities?.map(d => ({
                    label: d,
                    value: d,
                  })) || []
                }
              />
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
        <FormField
          control={form.control}
          name="departmentDecision"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Cơ quan quyết định</FormLabel>
              <FormControl>
                <Input
                  startIcon={Building}
                  type="text"
                  placeholder="Cơ quan quyết định"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isPending}
          className="w-full col-span-2"
        >
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
        <DialogContent className="max-h-[95vh] overflow-y-auto">
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
