import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import { createSalary } from '@/db/actions/progress-salaries';
import { createSalarySchema } from '@/lib/zod/schemas/record-schema';
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
import { DatePicker } from '@/components/ui/date-picker';
import { Combobox } from '@/components/ui/combobox';
import {
  BriefcaseBusiness,
  ChartNoAxesGantt,
  Hash,
} from 'lucide-react';
import { useGlobalStore } from '@/providers/global-store-provider';
import { Button } from '@/components/ui/button';
import { getAllSalaryGrades } from '@/db/queries/salary-grades';
import { getAllCivilServantRanks } from '@/db/queries/civil-servant-ranks';
import { getAllPublicEmployeeRanks } from '@/db/queries/public-employee-ranks';

export interface CreateSalaryFormProps {
  onSuccess: () => void;
  recordId: string;
  salaryGrades: ReturnType<typeof getAllSalaryGrades>;
  civilServantRanks: ReturnType<typeof getAllCivilServantRanks>;
  publicEmployeeRanks: ReturnType<typeof getAllPublicEmployeeRanks>;
}
export default function CreateSalaryForm({
  onSuccess,
  ...props
}: CreateSalaryFormProps) {
  const { fetchClassifications, classifications } = useGlobalStore(
    state => state,
  );
  const [isCreatePending, startCreateTransition] = useTransition();
  const { data: dataCivilServantRanks } = React.use(props.civilServantRanks);
  const { data: dataPublicEmployeeRanks } = React.use(
    props.publicEmployeeRanks,
  );
  const { data: dataSalaryGrades } = React.use(props.salaryGrades);
  const classificationsMapped = dataCivilServantRanks
    ?.concat(dataPublicEmployeeRanks || [])
    .map(c => ({
      label: c.name,
      value: c.id,
    }));

  const form = useForm<z.infer<typeof createSalarySchema>>({
    defaultValues: {},
  });

  const onSubmit = (values: z.infer<typeof createSalarySchema>) => {
    startCreateTransition(async () => {
      const { error } = await createSalary({
        ...values,
        recordId: props.recordId,
      });
      if (error) {
        toast.error(error);
        return;
      }
      onSuccess();
      toast.success('Quá trình lương đã được tạo');
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
          name="at"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tháng/Năm</FormLabel>
              <FormControl>
                <DatePicker
                  format="MM/YYYY"
                  date={field.value}
                  setDate={field.onChange}
                  placeholder="Tháng/Năm"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="classification"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ngạch</FormLabel>
              <FormControl>
                <Combobox
                  type="form"
                  startIcon={BriefcaseBusiness}
                  form={form}
                  placeholder="Chọn ngạch công chức"
                  field={field}
                  dataset={classificationsMapped || []}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="salaryGrade"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bậc lương</FormLabel>
              <FormControl>
                <Combobox
                  type="form"
                  startIcon={ChartNoAxesGantt}
                  form={form}
                  placeholder="Bậc lương"
                  field={field}
                  dataset={
                    dataSalaryGrades?.map(sg => ({
                      label: sg.name,
                      value: sg.id,
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
          name="salaryFactor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hệ số lương</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="numeric"
                  step="0.1"
                  startIcon={Hash}
                  pattern="[0-9]*"
                  placeholder="Hệ số lương"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isCreatePending}
          className="mt-5 w-full"
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
