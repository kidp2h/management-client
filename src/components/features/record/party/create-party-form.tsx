import { zodResolver } from '@hookform/resolvers/zod';
import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
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
import type { _getRecords } from '@/db/queries/records';
import {
  createPartySchema,
  CreatePartySchema,
} from '@/lib/zod/schemas/record-schema';
import { createParty } from '@/db/actions/parties';

// import { getAllFormParties } from '@/db/queries/form-parties';

export interface RecordsPartyFormProps {
  records: ReturnType<typeof _getRecords>;

  onSuccess: () => void;
  recordId: string;
}

export default function CreatePartyForm({
  records,

  onSuccess,
  ...props
}: RecordsPartyFormProps) {
  const form = useForm<CreatePartySchema>({
    resolver: zodResolver(createPartySchema),
    defaultValues: {},
  });
  // const { data } = use(records);

  const [openForm, setOpenForm] = React.useState(false);
  const [openList, setOpenList] = React.useState(false);
  const [isPending, startCreateTransition] = useTransition();
  const [selected, setSelected] = React.useState<Data[]>([]);
  const [selectedRecords, setSelectedRecords] = React.useState<Data[]>([]);
  const onSubmit = (values: CreatePartySchema) => {
    startCreateTransition(async () => {
      // console.log(values);
      const { error } = await createParty({
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
            name="organization"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tổ chức Đảng</FormLabel>
                <FormControl className="space-x-0 space-y-0">
                  <Input placeholder="Tổ chức Đảng" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dutyParty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chức vụ Đảng</FormLabel>
                <FormControl className="space-x-0 space-y-0">
                  <Input placeholder="Chức vụ Đảng" {...field} />
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
