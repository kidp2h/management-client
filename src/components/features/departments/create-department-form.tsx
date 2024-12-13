import React, { use, useTransition } from 'react';
import { toast } from 'sonner';

import { createDepartment } from '@/db/actions/departments';
import { createDepartmentSchema } from '@/lib/zod/schemas/department-schema';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Building, CaseUpper } from 'lucide-react';
import { getAllDepartments } from '@/db/queries/departments';
import { Combobox } from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';
import { flat } from '@/lib/utils';

export interface CreateDepartmentFormProps {
  onSuccess: () => void;
  departments: ReturnType<typeof getAllDepartments>;
}
export default function CreateDepartmentForm({
  onSuccess,
  departments,
}: CreateDepartmentFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  const form = useForm<z.infer<typeof createDepartmentSchema>>({
    resolver: zodResolver(createDepartmentSchema),
    defaultValues: {},
  });
  const result = use(departments);
  const onSubmit = (values: z.infer<typeof createDepartmentSchema>) => {
    startCreateTransition(async () => {
      try {
        await createDepartment(values);
        toast.success('Tạo phòng ban thành công');
        onSuccess();
      } catch (error) {
        toast.error('Tạo phòng ban thất bại');
      }
    });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Tên phòng ban, đơn vị</FormLabel>
              <FormControl>
                <Input
                  startIcon={CaseUpper}
                  type="text"
                  placeholder="Tên phòng ban"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="parent"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Đơn vị trên</FormLabel>
              <Combobox
                startIcon={Building}
                type="form"
                form={form}
                placeholder="Đơn vị trên"
                field={field}
                className="w-full"
                dataset={
                  flat(result?.data || [])?.map(d => ({
                    label: d.name,
                    value: d.id,
                  })) || []
                }
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Tạo
        </Button>
      </form>
    </Form>
  );
}
