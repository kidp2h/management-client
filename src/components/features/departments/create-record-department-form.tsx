import React, { use, useTransition } from 'react';
import { toast } from 'sonner';

import {
  createRecordDepartment,
} from '@/db/actions/departments';
import {
  createRecordDepartmentSchema,
} from '@/lib/zod/schemas/department-schema';
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
import { User } from 'lucide-react';
import { getAllDepartments } from '@/db/queries/departments';
import { Combobox } from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';
import { _getRecords } from '@/db/queries/records';

export interface CreateDepartmentFormProps {
  onSuccess: () => void;
  departments: ReturnType<typeof getAllDepartments>;
  cDepartment: Record<string, string>;
  records: ReturnType<typeof _getRecords>;
}
export default function CreateRecordDepartmentForm({
  onSuccess,
  cDepartment,
  records,
}: CreateDepartmentFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  const form = useForm<z.infer<typeof createRecordDepartmentSchema>>({
    resolver: zodResolver(createRecordDepartmentSchema),
    defaultValues: {},
  });
  const resultRecords = use(records);
  const onSubmit = (values: z.infer<typeof createRecordDepartmentSchema>) => {
    startCreateTransition(async () => {
      const { error } = await createRecordDepartment(
        values.recordId,
        cDepartment.id,
      );
      if (!error) toast.success('Tạo thành công');
      else toast.error(error);
      onSuccess();
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
          name="recordId"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Cán bộ</FormLabel>
              <FormControl>
                <Combobox
                  startIcon={User}
                  type="form"
                  form={form}
                  placeholder="Cán bộ"
                  field={field}
                  className="w-full"
                  dataset={
                    resultRecords?.data?.map(d => ({
                      label: `[${d.code}] - ${d.fullName}` || d.code,
                      value: d.id,
                    })) || []
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Input value={cDepartment?.name} disabled />
        <Button type="submit" className="w-full">
          Tạo
        </Button>
      </form>
    </Form>
  );
}
