import { zodResolver } from '@hookform/resolvers/zod';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Badge, Building, Building2 } from 'lucide-react';
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
import { createDual } from '@/db/actions/duals';
import type { _getRecords } from '@/db/queries/records';
import {
  createDualSchema,
  CreateDualSchema,
} from '@/lib/zod/schemas/record-schema';
import { Combobox } from '@/components/ui/combobox';
import { getDepartmentsByRecord } from '@/db/queries/departments';
import { getAllDuties } from '@/db/queries/duties';

export interface RecordsDualFormProps {
  records: ReturnType<typeof _getRecords>;
  departmentsOfRecord: ReturnType<typeof getDepartmentsByRecord>;
  // duals: ReturnType<typeof getAllDuals>;
  duties: ReturnType<typeof getAllDuties>;
  onSuccess: () => void;
  recordId: string;
}

export default function CreateDualForm({
  records,
  departmentsOfRecord,
  duties,
  onSuccess,
  ...props
}: RecordsDualFormProps) {
  const form = useForm<CreateDualSchema>({
    resolver: zodResolver(createDualSchema),
    defaultValues: {},
  });
  // const { data } = use(records);
  const resultDepartments = use(departmentsOfRecord);
  const resultDuties = use(duties);
  // const { data: dataFormDuals } = use(duals);
  const [openForm, setOpenForm] = React.useState(false);
  const [openList, setOpenList] = React.useState(false);
  const [isPending, startCreateTransition] = useTransition();
  const [selected, setSelected] = React.useState<Data[]>([]);
  const [selectedRecords, setSelectedRecords] = React.useState<Data[]>([]);
  const onSubmit = (values: CreateDualSchema) => {
    startCreateTransition(async () => {
      // console.log(values);
      const { error } = await createDual({
        ...values,
        recordId: props.recordId,
      });
      if (error) {
        toast.error(error);
        return;
      }
      onSuccess();
      toast.success('Dữ liệu đã được tạo');
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
            name="startDate"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Ngày bắt đầu</FormLabel>
                <FormControl className="space-x-0 space-y-0">
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                    placeholder="Ngày bắt đầu"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Ngày kết thúc</FormLabel>
                <FormControl className="space-x-0 space-y-0">
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                    placeholder="Ngày kết thúc"
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
            name="issuer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cơ quan ban hành</FormLabel>
                <FormControl className="space-x-0 space-y-0">
                  <Input
                    placeholder="Cơ quan ban hành"
                    {...field}
                    startIcon={Building2}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dateOfIssue"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Ngày ban hành</FormLabel>
                <FormControl className="space-x-0 space-y-0">
                  <DatePicker
                    date={field.value}
                    setDate={field.onChange}
                    placeholder="Ngày ban hành"
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
              <FormItem className="">
                <FormLabel>Đơn vị</FormLabel>
                <FormControl className="space-x-0 space-y-0">
                  <Combobox
                    startIcon={Building}
                    type="form"
                    form={form}
                    field={field}
                    placeholder="Chọn đơn vị"
                    dataset={
                      resultDepartments?.data?.map(d => ({
                        label: d.department.name,
                        value: d.department.id,
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
            name="duty"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Chức vụ</FormLabel>
                <FormControl className="space-x-0 space-y-0">
                  <Combobox
                    startIcon={Badge}
                    type="form"
                    form={form}
                    field={field}
                    placeholder="Chọn chức vụ"
                    dataset={
                      resultDuties?.data?.map(d => ({
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
