import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useCallback, useTransition } from 'react';
import { toast } from 'sonner';

import { updateLanguage } from '@/db/actions/record-languages';
import { updateLanguageSchema } from '@/lib/zod/schemas/record-schema';
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
import { Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllLanguages } from '@/db/queries/languages';
import { Input } from '@/components/ui/input';

export interface UpdateLanguageFormProps {
  onSuccess: () => void;
  recordId: string;

  languages: ReturnType<typeof getAllLanguages>;
  data: any;
}
export default function UpdateLanguageForm({
  onSuccess,
  data,
  ...props
}: UpdateLanguageFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();
  const rangeYears = useCallback((stop, step) => {
    const currentYear = new Date().getFullYear();

    return Array.from(
      { length: (stop - currentYear) / step + 1 },
      (_, i) => currentYear + i * step,
    );
  }, []);
  const form = useForm<z.infer<typeof updateLanguageSchema>>({
    defaultValues: {},
  });
  const onSubmit = (values: z.infer<typeof updateLanguageSchema>) => {
    startUpdateTransition(async () => {
      // console.log(values);
      const { error } = await updateLanguage({
        ...values,
        id: data.id,
      });
      if (error) {
        toast.error(error);
        return;
      }
      onSuccess();
      toast.success('Ngoại ngữ đã được cập nhật');
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
          name="language"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Ngôn ngữ</FormLabel>
              <FormControl className="space-x-0 space-y-0">
                <Combobox
                  startIcon={Book}
                  type="form"
                  form={form}
                  field={field}
                  placeholder="Chọn ngôn ngữ"
                  dataset={
                    (props?.languages as any)?.map(d => ({
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
          name="mark"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Điểm/Bậc</FormLabel>
              <FormControl className="space-x-0 space-y-0">
                <Input placeholder="Điểm/Bậc" {...field} />
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
