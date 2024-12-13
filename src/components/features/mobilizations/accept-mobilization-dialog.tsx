'use client';

import type { Row } from '@tanstack/react-table';
import {
  Barcode,
  Building,
  House,
  ListOrdered,
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
import { DatePicker } from '@/components/ui/date-picker';
import { useMediaQuery } from '@/hooks/use-media-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  acceptMobilizationSchema,
} from '@/lib/zod/schemas/record-schema';
import { zodResolver } from '@hookform/resolvers/zod';

import { Combobox } from '@/components/ui/combobox';
import {
  acceptMobilization,
} from '@/db/actions/mobilizations';
import { getAllFormSalary } from '@/db/queries/form-salary';
import { getAllCivilServantRanks } from '@/db/queries/civil-servant-ranks';
import { getAllSalaryGrades } from '@/db/queries/salary-grades';
import { getAllDuties } from '@/db/queries/duties';

interface AcceptMobilizationDialogProps
  extends React.ComponentPropsWithoutRef<typeof Dialog> {
  row: Row<any>['original'];
  formSalary: ReturnType<typeof getAllFormSalary>;
  civilServantRanks: ReturnType<typeof getAllCivilServantRanks>;
  salaryGrades: ReturnType<typeof getAllSalaryGrades>;
  duties: ReturnType<typeof getAllDuties>;
  childOfDepartments: any[];
  onSuccess?: () => void;
}

export function AcceptMobilizationDialog({
  row,
  onSuccess,
  formSalary,
  civilServantRanks,
  salaryGrades,
  duties,
  childOfDepartments,
  ...props
}: AcceptMobilizationDialogProps) {
  const [isPending, startTransition] = React.useTransition();
  const isDesktop = useMediaQuery('(min-width: 640px)');
  const form = useForm<z.infer<typeof acceptMobilizationSchema>>({
    resolver: zodResolver(acceptMobilizationSchema),
    defaultValues: {},
  });
  const { data: formSalaryData } = React.use(formSalary);
  const { data: civilServantRanksData } = React.use(civilServantRanks);
  const { data: salaryGradesData } = React.use(salaryGrades);
  const { data: dutiesData } = React.use(duties);
  // const { data: childOfDepartmentsData } = React.use(childOfDepartments);

  const formComponent = (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="formSalary"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Hình thức hưởng lương</FormLabel>
              <Combobox
                startIcon={Building}
                type="form"
                form={form}
                placeholder="Hình thức hưởng lương"
                field={field}
                className="w-full"
                dataset={
                  formSalaryData?.map(item => ({
                    label: item.name,
                    value: item.id,
                  })) || []
                }
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="civilServantRank"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Ngạch</FormLabel>
              <FormControl>
                <Combobox
                  startIcon={Barcode}
                  type="form"
                  form={form}
                  placeholder="Ngạch"
                  field={field}
                  className="w-full"
                  dataset={
                    civilServantRanksData?.map(item => ({
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
          name="salaryGrade"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Bậc</FormLabel>
              <FormControl>
                <Combobox
                  startIcon={ListOrdered}
                  type="form"
                  form={form}
                  placeholder="Bậc"
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
          name="dateSalary"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Ngày hưởng bậc</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                  placeholder="Ngày hưởng bậc"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duty"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Chức vụ</FormLabel>
              <FormControl>
                <Combobox
                  startIcon={Barcode}
                  type="form"
                  form={form}
                  placeholder="Chức vụ"
                  field={field}
                  className="w-full"
                  dataset={
                    dutiesData?.map(item => ({
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
          name="department"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Phòng công tác</FormLabel>
              <FormControl>
                <Combobox
                  startIcon={House}
                  type="form"
                  form={form}
                  placeholder="Phòng công tác"
                  field={field}
                  className="w-full"
                  dataset={
                    childOfDepartments?.map(item => ({
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
  function onSubmit(values: z.infer<typeof acceptMobilizationSchema>) {
    startTransition(async () => {
      const { error } = await acceptMobilization({
        id: row.id,
        recordId: row.record.id,
        fromDepartment: row.fromDepartment.id,
        ...values,
      });
      if (!error) {
        toast.success('Tiếp nhận hồ sơ thành công');
      } else {
        toast.error('Tiếp nhận hồ sơ thất bại. Vui lòng thử lại sau');
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
