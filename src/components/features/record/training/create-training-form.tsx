import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import { createTraining } from '@/db/actions/trainings';
import {
  CreateTrainingSchema,
  createTrainingSchema,
} from '@/lib/zod/schemas/record-schema';
import { Button } from '@/components/ui/button';
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
import { Combobox } from '@/components/ui/combobox';
import { DatePicker } from '@/components/ui/date-picker';
import { Book, BookA, GraduationCap, University } from 'lucide-react';
import { getAllQualifications } from '@/db/queries/qualifications';
import { getAllFormTrainings } from '@/db/queries/form-trainings';
import { Input } from '@/components/ui/input';

export interface CreateTrainingFormProps {
  onSuccess: () => void;
  recordId: string;
  qualifications: ReturnType<typeof getAllQualifications>;
  formTrainings: ReturnType<typeof getAllFormTrainings>;
}
export default function CreateTrainingForm({
  onSuccess,
  qualifications,
  formTrainings,
  ...props
}: CreateTrainingFormProps) {
  console.log(props);
  const [isCreatePending, startCreateTransition] = useTransition();
  const form = useForm<z.infer<typeof createTrainingSchema>>({
    defaultValues: {},
  });
  console.log(qualifications, formTrainings);
  const { data: dataQualifications } = React.use(qualifications);
  const { data: dataFormTrainings } = React.use(formTrainings);
  const onSubmit = (values: CreateTrainingSchema) => {
    startCreateTransition(async () => {
      const { error } = await createTraining({
        ...values,
        recordId: props.recordId,
      });
      if (error) {
        toast.error(error);
        return;
      }
      onSuccess();
      toast.success('Quá trình đào tạo chuyên môn đã được tạo');
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
                    dataFormTrainings?.map(d => ({
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
                    dataQualifications?.map(d => ({
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
          disabled={isCreatePending}
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
