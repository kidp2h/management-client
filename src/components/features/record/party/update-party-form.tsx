import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useCallback, useTransition } from 'react';
import { toast } from 'sonner';

import { updatePartySchema } from '@/lib/zod/schemas/record-schema';
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
import { Button } from '@/components/ui/button';
// import { getAllDepartments } from '@/db/queries/departments';
// import { getAllFormParties } from '@/db/queries/form-parties';
import { updateParty } from '@/db/actions/parties';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';

export interface UpdatePartyFormProps {
  onSuccess: () => void;
  recordId: string;

  data: any;
}
export default function UpdatePartyForm({
  onSuccess,
  data,
  ...props
}: UpdatePartyFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();
  const rangeYears = useCallback((stop, step) => {
    const currentYear = new Date().getFullYear();

    return Array.from(
      { length: (stop - currentYear) / step + 1 },
      (_, i) => currentYear + i * step,
    );
  }, []);
  const form = useForm<z.infer<typeof updatePartySchema>>({
    defaultValues: {},
  });
  const onSubmit = (values: z.infer<typeof updatePartySchema>) => {
    startUpdateTransition(async () => {
      // console.log(values);
      const { error } = await updateParty({
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
          name="organization"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tổ chức Đảng</FormLabel>
              <FormControl className="space-x-0 space-y-0">
                <Input placeholder="Tổ chức Đảng" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dutyParty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chức vụ Đảng</FormLabel>
              <FormControl className="space-x-0 space-y-0">
                <Input placeholder="Chức vụ Đảng" {...field} />
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
