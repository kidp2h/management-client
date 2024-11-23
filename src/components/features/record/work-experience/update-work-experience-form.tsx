import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateWorkExperience } from '@/db/actions/work-experiences';
import {
  UpdateWorkExperienceSchema,
  updateWorkExperienceSchema,
} from '@/lib/zod/schemas/record-schema';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { DatePicker } from '@/components/ui/date-picker';
import { Combobox } from '@/components/ui/combobox';
import { Building, FlagTriangleLeft } from 'lucide-react';

export interface UpdateWorkExperienceFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateWorkExperienceSchema>>;
  data: any;
}
export default function UpdateWorkExperienceForm({
  onSuccess,
  fieldConfig,
  data,
  ...props
}: UpdateWorkExperienceFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();
  const form = useForm<z.infer<typeof updateWorkExperienceSchema>>({
    defaultValues: {
      ...data,
      duty: data.duty?.id,
      department: data.department?.id,
    },
  });
  const onSubmit = (values: UpdateWorkExperienceSchema) => {
    startUpdateTransition(async () => {
      const { error } = await updateWorkExperience({
        id: data.id,
        ...values,
      });
      console.error(error);
      if (error) {
        toast.error('Cập nhật quá trình công tác thất bại');
        return;
      }
      onSuccess();
      toast.success('Quá trình công tác đã được cập nhật');
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-5 "
      >
        <FormField
          control={form.control}
          name="from"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Từ</FormLabel>
              <DatePicker
                date={field.value}
                setDate={field.onChange}
                placeholder="Từ"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        đ
        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Đến</FormLabel>
              <DatePicker
                date={field.value}
                setDate={field.onChange}
                placeholder="Đến"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="duty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chức vụ</FormLabel>
              <FormControl>
                <Combobox
                  startIcon={FlagTriangleLeft}
                  type="form"
                  form={form}
                  placeholder="Chức vụ"
                  field={field}
                  className="w-full"
                  dataset={
                    (props as any).duties?.map(d => ({
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
          name="department"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Đơn vị công tác</FormLabel>
              <FormControl>
                <Combobox
                  startIcon={Building}
                  type="form"
                  form={form}
                  placeholder="Đơn vị công tác"
                  field={field}
                  className="w-full"
                  dataset={
                    (props as any).departments?.map(d => ({
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
        <Button
          type="submit"
          className="mt-5 w-full"
          disabled={isUpdatePending}
        >
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
