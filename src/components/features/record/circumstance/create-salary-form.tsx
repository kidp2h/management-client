import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import { createSalary } from '@/db/actions/salary';
import { createSalarySchema } from '@/lib/zod/schemas/record-schema';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { Combobox } from '@/components/ui/combobox';
import {
  BadgeDollarSign,
  BriefcaseBusiness,
  ChartNoAxesGantt,
  Hash,
} from 'lucide-react';
import { useGlobalStore } from '@/providers/global-store-provider';
import { Button } from '@/components/ui/button';

export interface CreateSalaryFormProps {
  onSuccess: () => void;
  recordId: string;
}
export default function CreateSalaryForm({
  onSuccess,
  ...props
}: CreateSalaryFormProps) {
  const { fetchClassifications, classifications } = useGlobalStore(
    state => state,
  );
  const [isCreatePending, startCreateTransition] = useTransition();
  const classificationsMapped = classifications.map(i => ({
    label: `[${i.code}] ${i.name}`,
    value: `[${i.code}] ${i.name}`,
  }));

  const form = useForm<z.infer<typeof createSalarySchema>>({
    defaultValues: {},
  });
  React.useEffect(() => {
    fetchClassifications();
  }, [fetchClassifications]);
  const onSubmit = (values: z.infer<typeof createSalarySchema>) => {
    startCreateTransition(async () => {
      const { error } = await createSalary({
        ...values,
        recordId: props.recordId,
      });
      if (error) {
        toast.error(error);
        return;
      }
      onSuccess();
      toast.success('Quá trình lương đã được tạo');
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
            <FormItem>
              <FormLabel>Từ</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                  placeholder="Từ"
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
            <FormItem>
              <FormLabel>Đến</FormLabel>
              <FormControl>
                <DatePicker
                  date={field.value}
                  setDate={field.onChange}
                  placeholder="Đến"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="classification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Đến</FormLabel>
              <FormControl>
                <Combobox
                  type="form"
                  startIcon={BriefcaseBusiness}
                  form={form}
                  placeholder="Chọn ngạch công chức"
                  field={field}
                  lazy={false}
                  dataset={classificationsMapped}
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
            <FormItem>
              <FormLabel>Bậc lương</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="numeric"
                  startIcon={ChartNoAxesGantt}
                  pattern="[0-9]*"
                  placeholder="Bậc lương"
                  {...field}
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
            <FormItem>
              <FormLabel>Hệ số lương</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="numeric"
                  step="0.1"
                  startIcon={Hash}
                  pattern="[0-9]*"
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
          name="salary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tiền lương</FormLabel>
              <FormControl>
                <Input
                  startIcon={BadgeDollarSign}
                  placeholder="Tiền lương"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isCreatePending}
          className="mt-5 w-full"
        >
          {isCreatePending && (
            <ReloadIcon
              className="mr-2 size-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Tạo
        </Button>
      </form>
    </Form>
  );
}
