import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useCallback, useTransition } from 'react';
import { toast } from 'sonner';

import { createCommendation } from '@/db/actions/commendations';
import { createCommendationSchema } from '@/lib/zod/schemas/record-schema';
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
import { Award, Badge } from 'lucide-react';
import { getAllAppellations } from '@/db/queries/appellations';
import { Button } from '@/components/ui/button';

export interface CreateCommendationFormProps {
  onSuccess: () => void;
  recordId: string;
  appellations: ReturnType<typeof getAllAppellations>;
}
export default function CreateCommendationForm({
  onSuccess,
  ...props
}: CreateCommendationFormProps) {
  console.log(props);
  const [isCreatePending, startCreateTransition] = useTransition();
  const rangeYears = useCallback((stop, step) => {
    const currentYear = new Date().getFullYear();

    return Array.from(
      { length: (stop - currentYear) / step + 1 },
      (_, i) => currentYear + i * step,
    );
  }, []);
  const { data: appellations } = React.use(props.appellations);
  const form = useForm<z.infer<typeof createCommendationSchema>>({
    defaultValues: {},
  });
  const onSubmit = (values: z.infer<typeof createCommendationSchema>) => {
    startCreateTransition(async () => {
      const { error } = await createCommendation({
        ...values,
        recordId: props.recordId,
      });
      if (error) {
        toast.error(error);
        return;
      }
      onSuccess();
      toast.success('Khen thưởng đã được tạo');
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
          name="award"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Từ</FormLabel>
              <FormControl>
                <Combobox
                  startIcon={Badge}
                  type="form"
                  form={form}
                  placeholder="Chọn Huân chương / Huy chương"
                  field={field}
                  className="w-full"
                  dataset={
                    appellations?.map(a => ({
                      label: a.name,
                      value: a.id,
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
          name="year"
          render={({ field }) => (
            <FormItem className="col-span-3 lg:col-span-1">
              <FormLabel>Danh hiệu được phong năm nào</FormLabel>
              <FormControl>
                <Combobox
                  startIcon={Award}
                  type="form"
                  form={form}
                  field={field}
                  placeholder="Năm được phong tặng"
                  dataset={rangeYears(1960, -1).map(year => ({
                    label: year.toString(),
                    value: year.toString(),
                  }))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isCreatePending}>
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
