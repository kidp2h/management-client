'use client';

import type { Row } from '@tanstack/react-table';
import { Binary, Book, Building, HandCoins, ListOrdered } from 'lucide-react';
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
import {
  createIncreaseSalaryRegular,
  updateRecord,
} from '@/db/actions/records';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { increaseSalarySchema } from '@/lib/zod/schemas/record-schema';
import { zodResolver } from '@hookform/resolvers/zod';

import { Combobox } from '@/components/ui/combobox';

import { getAllSalaryGrades } from '@/db/queries/salary-grades';

interface IncreaseSalaryRegularDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  row: Row<any>['original'];
  salaryGrades: ReturnType<typeof getAllSalaryGrades>;
  cDepartment: any;
  onSuccess?: () => void;
}

export function IncreaseSalaryRegularDialog({
  row,
  onSuccess,
  salaryGrades,
  cDepartment,
  ...props
}: IncreaseSalaryRegularDialogProps) {
  const [isPending, startTransition] = React.useTransition();
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const form = useForm<z.infer<typeof increaseSalarySchema>>({
    resolver: zodResolver(increaseSalarySchema),
    defaultValues: {},
  });

  const { data: salaryGradesData } = React.use(salaryGrades);

  const formComponent = (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="decisionNumber"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Số quyết định</FormLabel>
              <Input startIcon={Book} placeholder="Số quyết định" {...field} />
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
          name="department"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Cơ quan quyết định</FormLabel>
              <FormControl>
                <Input
                  startIcon={Building}
                  placeholder="Cơ quan quyết định"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="salaryGrade"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Bậc lương</FormLabel>
              <FormControl>
                <Combobox
                  startIcon={ListOrdered}
                  type="form"
                  form={form}
                  placeholder="Bậc lương"
                  field={field}
                  className="w-full"
                  dataset={
                    salaryGradesData?.map(item => ({
                      label: item.name,
                      value: item.id,
                    })) || []
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="salaryFactor"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Hệ số lương</FormLabel>
              <FormControl>
                <Input
                  startIcon={Binary}
                  placeholder="Hệ số lương"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="overAllowance"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Phụ cấp vượt khung</FormLabel>
              <FormControl>
                <Input
                  startIcon={HandCoins}
                  placeholder="Phụ cấp vượt khung"
                  unit="%"
                  {...field}
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
  function onSubmit(values: z.infer<typeof increaseSalarySchema>) {
    startTransition(async () => {
      const { error } = await updateRecord({
        salaryGradeId: values.salaryGrade,
        salaryFactor: values.salaryFactor,
        lastIncreaseSalary: new Date(),
        overAllowance: values.overAllowance,
        id: row.record.id,
      });
      const {} = await createIncreaseSalaryRegular({
        salaryFactor: values.salaryFactor,
        salaryGrade: values.salaryGrade,
        overAllowance: values.overAllowance,
        recordId: row.record.id,
        decisionNumber: values.decisionNumber,
        decisionDate: values.dateDecision,
        department: cDepartment.id,
        decisionDepartment: values.department,

        preOverAllowance: row.overAllowance,
        previousSalaryFactor: row.salaryFactor,
        previousSalaryGrade: row.salaryGrade.id,
      });
      if (!error) {
        toast.success('Tăng lương thường xuyên thành công');
      } else {
        toast.error('Tăng lương thường xuyên thất bại. Vui lòng thử lại sau');
      }
      props.onOpenChange?.(false);
      onSuccess?.();
    });
  }

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
          {/* hi{JSON.stringify(row)} */}
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
            <Button variant="outline" className="w-full">
              Huỷ
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}