import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useCallback, useTransition } from 'react';
import { toast } from 'sonner';

import { updateDiscipline } from '@/db/actions/disciplines';
import { updateDisciplineSchema } from '@/lib/zod/schemas/record-schema';
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
import { Building, ShieldMinus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllDepartments } from '@/db/queries/departments';
import { getAllFormDisciplines } from '@/db/queries/form-disciplines';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';

export interface UpdateDisciplineFormProps {
  onSuccess: () => void;
  recordId: string;

  departments: ReturnType<typeof getAllDepartments>;
  formDisciplines: ReturnType<typeof getAllFormDisciplines>;
  data: any;
}
export default function UpdateDisciplineForm({
  onSuccess,
  data,
  ...props
}: UpdateDisciplineFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();
  const rangeYears = useCallback((stop, step) => {
    const currentYear = new Date().getFullYear();

    return Array.from(
      { length: (stop - currentYear) / step + 1 },
      (_, i) => currentYear + i * step,
    );
  }, []);
  const form = useForm<z.infer<typeof updateDisciplineSchema>>({
    defaultValues: {},
  });
  const onSubmit = (values: z.infer<typeof updateDisciplineSchema>) => {
    startUpdateTransition(async () => {
      // console.log(values);
      const { error } = await updateDiscipline({
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
          name="from"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Từ ngày</FormLabel>
              <FormControl className="space-x-0 space-y-0">
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                  placeholder="Từ ngày"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Đến ngày</FormLabel>
              <FormControl className="space-x-0 space-y-0">
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                  placeholder="Đến ngày"
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
          name="decisionDate"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Ngày quyết định</FormLabel>
              <FormControl className="space-x-0 space-y-0">
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
          name="decisionDepartment"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Cơ quan quyết định</FormLabel>
              <FormControl className="space-x-0 space-y-0">
                <Combobox
                  startIcon={Building}
                  type="form"
                  form={form}
                  field={field}
                  placeholder="Chọn cơ quan quyết định"
                  dataset={
                    (props?.departments as any)?.map(d => ({
                      label: d.name,
                      value: d.id,
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
          name="formDiscipline"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Hình thức kỷ luật</FormLabel>
              <FormControl className="space-x-0 space-y-0">
                <Combobox
                  startIcon={ShieldMinus}
                  type="form"
                  form={form}
                  field={field}
                  placeholder="Chọn hình thức kỷ luật"
                  dataset={
                    (props?.formDisciplines as any)?.map(d => ({
                      label: d.name,
                      value: d.id,
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
