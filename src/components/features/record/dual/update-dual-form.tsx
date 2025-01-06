import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useCallback, useTransition } from 'react';
import { toast } from 'sonner';

import { updateDual } from '@/db/actions/duals';
import { updateDualSchema } from '@/lib/zod/schemas/record-schema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Combobox } from '@/components/ui/combobox';
import { Building, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getDepartmentsByRecord } from '@/db/queries/departments';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';

export interface UpdateDualFormProps {
  onSuccess: () => void;
  recordId: string;

  departmentsOfRecord: ReturnType<typeof getDepartmentsByRecord>;
  data: any;
}
export default function UpdateDualForm({
  onSuccess,
  data,
  ...props
}: UpdateDualFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();
  const rangeYears = useCallback((stop, step) => {
    const currentYear = new Date().getFullYear();

    return Array.from(
      { length: (stop - currentYear) / step + 1 },
      (_, i) => currentYear + i * step,
    );
  }, []);
  const form = useForm<z.infer<typeof updateDualSchema>>({
    defaultValues: {},
  });
  const onSubmit = (values: z.infer<typeof updateDualSchema>) => {
    startUpdateTransition(async () => {
      // console.log(values);
      const { error } = await updateDual({
        ...values,
        id: data.id,
      });
      if (error) {
        toast.error(error);
        return;
      }
      onSuccess();
      toast.success('Kỷ luật đã được cập nhật');
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Ngày bắt đầu</FormLabel>
              <FormControl className="space-x-0 space-y-0">
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                  placeholder="Ngày bắt đầu"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Ngày kết thúc</FormLabel>
              <FormControl className="space-x-0 space-y-0">
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                  placeholder="Ngày kết thúc"
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
            <FormItem>
              <FormLabel>Số quyết định</FormLabel>
              <FormControl className="space-x-0 space-y-0">
                <Input placeholder="Số quyết định" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="issuer"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cơ quan ban hành</FormLabel>
              <FormControl className="space-x-0 space-y-0">
                <Input
                  placeholder="Cơ quan ban hành"
                  {...field}
                  startIcon={Building2}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dateOfIssue"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Ngày ban hành</FormLabel>
              <FormControl className="space-x-0 space-y-0">
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                  placeholder="Ngày ban hành"
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
            <FormItem className="">
              <FormLabel>Đơn vị</FormLabel>
              <FormControl className="space-x-0 space-y-0">
                <Combobox
                  startIcon={Building}
                  type="form"
                  form={form}
                  field={field}
                  placeholder="Chọn đơn vị"
                  dataset={
                    (props.departmentsOfRecord as any)?.data?.map(d => ({
                      label: d.department.name,
                      value: d.department,
                    })) || []
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isUpdatePending}>
          {isUpdatePending && (
            <ReloadIcon
              className="mr-2 size-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Cập nhật
        </Button>
      </form>
    </Form>
  );
}