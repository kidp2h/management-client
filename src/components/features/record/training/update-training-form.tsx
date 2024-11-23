import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateTraining } from '@/db/actions/trainings';
import {
  UpdateTrainingSchema,
  updateTrainingSchema,
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
import { Combobox } from '@/components/ui/combobox';
import { DatePicker } from '@/components/ui/date-picker';
import { Book, BookA, GraduationCap, University } from 'lucide-react';
import { Input } from '@/components/ui/input';

export interface UpdateTrainingFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateTrainingSchema>>;
  data: any;
}
export default function UpdateTrainingForm({
  onSuccess,
  fieldConfig,
  data,
  ...props
}: UpdateTrainingFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();
  const form = useForm<z.infer<typeof updateTrainingSchema>>({
    defaultValues: {
      ...data,
      qualification: data.qualification?.id,
      formTraining: data.formTraining?.id,
    },
  });
  const onSubmit = (values: UpdateTrainingSchema) => {
    startUpdateTransition(async () => {
      const { error } = await updateTraining({
        id: data.id,
        ...values,
      });
      console.error(error);
      if (error) {
        toast.error('Cập nhật quá trình đào tạo chuyên môn thất bại');
        return;
      }
      onSuccess();
      toast.success('Quá trình đào tạo chuyên môn đã được cập nhật');
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
          name="nameOfTrainingInstitution"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên trường</FormLabel>
              <FormControl>
                <Input
                  startIcon={University}
                  placeholder="Tên trường"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="majors"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngành học hoặc tên lớp học</FormLabel>
              <FormControl>
                <Input
                  startIcon={BookA}
                  placeholder="Ngành học hoặc tên lớp học"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="from"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Được đào tạo từ</FormLabel>
              <DatePicker
                date={field.value}
                setDate={field.onChange}
                placeholder="Được đào tạo từ"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="to"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Được đào tạo đến</FormLabel>
              <DatePicker
                date={field.value}
                setDate={field.onChange}
                placeholder="Được đào tạo đến"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="formTraining"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hình thức học</FormLabel>
              <FormControl>
                <Combobox
                  startIcon={Book}
                  type="form"
                  form={form}
                  placeholder="Hình thức học"
                  field={field}
                  className="w-full"
                  dataset={
                    (props as any).formTrainings?.map(d => ({
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
          name="qualification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Trình độ</FormLabel>
              <FormControl>
                <Combobox
                  startIcon={GraduationCap}
                  type="form"
                  form={form}
                  placeholder="Trình độ"
                  field={field}
                  className="w-full"
                  dataset={
                    (props as any).qualifications?.map(d => ({
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
