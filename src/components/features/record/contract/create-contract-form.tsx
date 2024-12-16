import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import { createContract } from '@/db/actions/records';
import { createContractSchema } from '@/lib/zod/schemas/record-schema';
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
import { BookA, GraduationCap } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getAllFormRecruitments } from '@/db/queries/form-recruitments';
import { zodResolver } from '@hookform/resolvers/zod';
import { getAllTypeContracts } from '@/db/queries/type-contracts';

export interface CreateContractFormProps {
  onSuccess: () => void;
  formRecruitments: ReturnType<typeof getAllFormRecruitments>;
  typeContracts: ReturnType<typeof getAllTypeContracts>;
  recordId: string;
}
export default function CreateContractForm({
  onSuccess,
  formRecruitments,
  typeContracts,
  ...props
}: CreateContractFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  const form = useForm<z.infer<typeof createContractSchema>>({
    resolver: zodResolver(createContractSchema),
  });
  const { data: dataFormRecruitments } = React.use(formRecruitments);
  const { data: dataTypeContracts } = React.use(typeContracts);
  const onSumbit = async values => {
    startCreateTransition(async () => {
      const { error } = await createContract({
        ...values,
        recordId: props.recordId,
      });
      if (error) {
        toast.error(error);
        return;
      }
      onSuccess();
      toast.success('Hợp đồng đã được tạo');
    });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSumbit)}
        className="flex flex-col gap-5"
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
                placeholder="Hợp đồng bắt đầu từ"
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
                placeholder="Hợp đồng kết thúc lúc"
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="decisionNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số quyết định</FormLabel>
              <FormControl>
                <Input
                  startIcon={BookA}
                  placeholder="Số quyết định"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="typeContract"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại hợp đồng</FormLabel>
              <FormControl>
                <Combobox
                  type="form"
                  form={form}
                  placeholder="Loại hợp đồng"
                  field={field}
                  className="w-full"
                  dataset={
                    dataTypeContracts?.map(d => ({
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
          name="recruimentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hình thức tuyển dụng</FormLabel>
              <FormControl>
                <Combobox
                  startIcon={GraduationCap}
                  type="form"
                  form={form}
                  placeholder="Hình thức tuyển dụng"
                  field={field}
                  className="w-full"
                  dataset={
                    dataFormRecruitments?.map(d => ({
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
          name="dateRecruiment"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Ngày tuyển dụng</FormLabel>
              <DatePicker
                date={field.value}
                setDate={field.onChange}
                placeholder="Ngày tuyển dụng"
              />
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
