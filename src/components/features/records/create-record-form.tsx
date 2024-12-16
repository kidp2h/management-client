import { TypeOutline } from 'lucide-react';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import { createRecord } from '@/db/actions/records';
import { createRecordSchema } from '@/lib/zod/schemas/record-schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { z } from 'zod';

export interface CreateRecordFormProps {
  onSuccess: () => void;
}
export default function CreateRecordForm({ onSuccess }: CreateRecordFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  const form = useForm<z.infer<typeof createRecordSchema>>({
    resolver: zodResolver(createRecordSchema),
    defaultValues: {},
  });
  const onSubmit = (values: z.infer<typeof createRecordSchema>) => {
    startCreateTransition(async () => {
      try {
        await createRecord(values);
        toast.success('Tạo bản ghi thành công');
        onSuccess();
      } catch (error) {
        toast.error('Tạo bản ghi thất bại');
      }
    });
  };
  // const { ranks } = useGlobalStore(state => state);
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Họ và tên</FormLabel>
              <FormControl>
                <Input
                  startIcon={TypeOutline}
                  type="text"
                  placeholder="Họ và tên"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
