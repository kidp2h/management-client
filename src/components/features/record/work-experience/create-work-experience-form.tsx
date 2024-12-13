import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import { createWorkExperience } from '@/db/actions/work-experiences';
import {
  CreateWorkExperienceSchema,
  createWorkExperienceSchema,
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
import { DatePicker } from '@/components/ui/date-picker';
import { Combobox } from '@/components/ui/combobox';
import { getAllDuties } from '@/db/queries/duties';
import { getAllDepartments } from '@/db/queries/departments';
import { Building, FlagTriangleLeft } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { flat } from '@/lib/utils';

export interface CreateWorkExperienceFormProps {
  onSuccess: () => void;
  recordId: string;
  duties: ReturnType<typeof getAllDuties>;
  departments: ReturnType<typeof getAllDepartments>;
}
export default function CreateWorkExperienceForm({
  onSuccess,
  duties,
  departments,
  ...props
}: CreateWorkExperienceFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  const { data: dataDuties } = React.use(duties);
  const { data: dataDepartments } = React.use(departments);
  const form = useForm<z.infer<typeof createWorkExperienceSchema>>({
    resolver: zodResolver(createWorkExperienceSchema),
    defaultValues: {},
  });
  const onSubmit = (values: CreateWorkExperienceSchema) => {
    startCreateTransition(async () => {
      const { error } = await createWorkExperience({
        ...values,
        recordId: props.recordId,
      });
      if (error) {
        toast.error(error);
        return;
      }
      onSuccess();
      toast.success('Quá trình công tác đã được tạo');
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
                    dataDuties?.map(d => ({
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
                    flat(dataDepartments)?.map(d => ({
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
