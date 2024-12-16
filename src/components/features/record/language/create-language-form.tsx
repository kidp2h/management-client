import { zodResolver } from '@hookform/resolvers/zod';
import { ReloadIcon } from '@radix-ui/react-icons';
import { Book } from 'lucide-react';
import React, { use, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

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
import { createLanguage } from '@/db/actions/record-languages';
import type { _getRecords } from '@/db/queries/records';
import {
  createLanguageSchema,
  CreateLanguageSchema,
} from '@/lib/zod/schemas/record-schema';
import { Combobox } from '@/components/ui/combobox';
import { getAllLanguages } from '@/db/queries/languages';

export interface RecordsLanguageFormProps {
  records: ReturnType<typeof _getRecords>;
  languages: ReturnType<typeof getAllLanguages>;
  onSuccess: () => void;
  recordId: string;
}

export default function CreateLanguageForm({
  records,
  languages,
  onSuccess,
  ...props
}: RecordsLanguageFormProps) {
  const form = useForm<CreateLanguageSchema>({
    resolver: zodResolver(createLanguageSchema),
    defaultValues: {},
  });
  // const { data } = use(records);
  const { data: dataLanguages } = use(languages);
  const [openForm, setOpenForm] = React.useState(false);
  const [openList, setOpenList] = React.useState(false);
  const [isPending, startCreateTransition] = useTransition();
  const [selected, setSelected] = React.useState<Data[]>([]);
  const [selectedRecords, setSelectedRecords] = React.useState<Data[]>([]);
  const onSubmit = (values: CreateLanguageSchema) => {
    startCreateTransition(async () => {
      // console.log(values);
      const { error } = await createLanguage({
        ...values,
        recordId: props.recordId,
      });
      if (error) {
        toast.error(error);
        return;
      }
      onSuccess();
      toast.success('Ngoại ngữ đã được tạo');
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
            name="language"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Ngôn ngữ</FormLabel>
                <FormControl className="space-x-0 space-y-0">
                  <Combobox
                    startIcon={Book}
                    type="form"
                    form={form}
                    field={field}
                    placeholder="Chọn ngôn ngữ"
                    dataset={
                      dataLanguages?.map(d => ({
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
            name="mark"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Điểm/Bậc</FormLabel>
                <FormControl className="space-x-0 space-y-0">
                  <Input placeholder="Điểm/Bậc" {...field} />
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
