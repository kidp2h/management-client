import { zodResolver } from '@hookform/resolvers/zod';
import { ReloadIcon } from '@radix-ui/react-icons';
import {
  Building,
  ShieldMinus,
} from 'lucide-react';
import React, { use, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { DatePicker } from '@/components/ui/date-picker';
import type { Data } from '@/components/ui/fancy-combobox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createDiscipline } from '@/db/actions/disciplines';
import type { _getRecords } from '@/db/queries/records';
import {
  createDisciplineSchema,
  CreateDisciplineSchema,
} from '@/lib/zod/schemas/record-schema';
import { Combobox } from '@/components/ui/combobox';
import { getAllDepartments } from '@/db/queries/departments';
import { getAllFormDisciplines } from '@/db/queries/form-disciplines';

export interface RecordsDisciplineFormProps {
  records: ReturnType<typeof _getRecords>;
  departments: ReturnType<typeof getAllDepartments>;
  formDisciplines: ReturnType<typeof getAllFormDisciplines>;
  onSuccess: () => void;
  recordId: string;
}

export default function CreateDisciplineForm({
  records,
  departments,
  formDisciplines,
  onSuccess,
  ...props
}: RecordsDisciplineFormProps) {
  const form = useForm<CreateDisciplineSchema>({
    resolver: zodResolver(createDisciplineSchema),
    defaultValues: {},
  });
  // const { data } = use(records);
  const { data: dataDepartments } = use(departments);
  const { data: dataFormDisciplines } = use(formDisciplines);
  const [openForm, setOpenForm] = React.useState(false);
  const [openList, setOpenList] = React.useState(false);
  const [isPending, startCreateTransition] = useTransition();
  const [selected, setSelected] = React.useState<Data[]>([]);
  const [selectedRecords, setSelectedRecords] = React.useState<Data[]>([]);
  const onSubmit = (values: CreateDisciplineSchema) => {
    startCreateTransition(async () => {
      console.log(values);
      const { error } = await createDiscipline({
        ...values,
        recordId: props.recordId,
      });
      if (error) {
        toast.error(error);
        return;
      }
      onSuccess();
      toast.success('Kỷ luật đã được tạo');
    });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8 "
      >
        <div className="grid grid-cols-1 gap-2 ">
          <FormField
            control={form.control}
            name="from"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Từ ngày</FormLabel>
                <FormControl className="space-x-0 space-y-0">
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                    placeholder="Từ ngày"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="to"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Đến ngày</FormLabel>
                <FormControl className="space-x-0 space-y-0">
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                    placeholder="Đến ngày"
                  />
                </FormControl>
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
                <FormControl className="space-x-0 space-y-0">
                  <Input placeholder="Số quyết định" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="decisionDate"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Ngày quyết định</FormLabel>
                <FormControl className="space-x-0 space-y-0">
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                    placeholder="Ngày quyết định"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="decisionDepartment"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Cơ quan quyết định</FormLabel>
                <FormControl className="space-x-0 space-y-0">
                  <Combobox
                    startIcon={Building}
                    type="form"
                    form={form}
                    field={field}
                    placeholder="Chọn cơ quan quyết định"
                    dataset={
                      dataDepartments?.map(d => ({
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
            name="formDiscipline"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Hình thức kỷ luật</FormLabel>
                <FormControl className="space-x-0 space-y-0">
                  <Combobox
                    startIcon={ShieldMinus}
                    type="form"
                    form={form}
                    field={field}
                    placeholder="Chọn hình thức kỷ luật"
                    dataset={
                      dataFormDisciplines?.map(d => ({
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
          <Button type="submit" className="mt-5" disabled={isPending}>
            {isPending && (
              <ReloadIcon
                className="mr-2 size-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Tạo
          </Button>
        </div>

        {/* {selected.map(item => (
          <div key={item.value}>
            <Badge variant="outline">{item.label}</Badge>
            <FancyMultiCombobox
              className="mt-3"
              selected={selectedRecords}
              setSelected={setSelectedRecords}
              placeholder="Cán bộ"
              id={item.value}
              dataset={data?.map((record: any) => ({
                value: record.id!,
                label: `${record.fullName!} `,
                id: item.value,
              }))}
            />
          </div>
        ))} */}
      </form>
    </Form>
  );
}
