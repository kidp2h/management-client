import React, { use, useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateDepartment } from '@/db/actions/departments';
import { updateDepartmentSchema } from '@/lib/zod/schemas/department-schema';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export interface UpdateDepartmentFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateDepartmentSchema>>;
  departments: ReturnType<typeof getAllDepartments>;
  data: any;
}
export default function UpdateDepartmentForm({
  onSuccess,
  departments,
  data,
}: UpdateDepartmentFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();
  const form = useForm<z.infer<typeof updateDepartmentSchema>>({
    resolver: zodResolver(updateDepartmentSchema),
    defaultValues: {
      ...data,
      parent: data?.parent || undefined,
    },
  });
  console.log(data);
  const result = use(departments);
  const onSubmit = (values: z.infer<typeof updateDepartmentSchema>) => {
    startUpdateTransition(async () => {
      try {
        await updateDepartment({
          ...values,
          id: data.id,
        });
        toast.success('Cập nhật phòng ban thành công');
        onSuccess();
      } catch (error) {
        toast.error('Cập nhật phòng ban thất bại');
      }
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
              <FormLabel>Phòng ban cấp trên</FormLabel>
              <Combobox
                startIcon={Building}
                type="form"
                form={form}
                placeholder="Phòng ban cấp trên"
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
          Cập nhật
        </Button>
      </form>
    </Form>
  );
}
