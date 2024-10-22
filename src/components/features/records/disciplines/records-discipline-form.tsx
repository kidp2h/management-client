import { zodResolver } from '@hookform/resolvers/zod';
import { ReloadIcon } from '@radix-ui/react-icons';
import _ from 'lodash';
import { ChevronDown, ChevronUp, SaveIcon } from 'lucide-react';
import React, { use, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { DatePicker } from '@/components/ui/date-picker';
import { type Data, FancyMultiCombobox } from '@/components/ui/fancy-combobox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createDisciplines } from '@/db/actions/disciplines';
import type { _getRecords } from '@/db/queries/records';
import { enumDisciplineType } from '@/db/schema';
import {
  type DisciplineRecordSchema,
  disciplineRecordSchema,
} from '@/lib/zod/schemas/record-schema';

export interface RecordsDisciplineFormProps {
  records: ReturnType<typeof _getRecords>;
}

export default function RecordsDisciplineForm({
  records,
}: RecordsDisciplineFormProps) {
  const form = useForm<DisciplineRecordSchema>({
    resolver: zodResolver(disciplineRecordSchema),
    defaultValues: {
      from: new Date(),
      to: new Date('2025-12-12'),
      decisionDate: new Date(),
      decisionNumber: '123',
      decisionDepartment: '123123',
    },
  });
  const { data } = use(records);
  const [openForm, setOpenForm] = React.useState(false);
  const [openList, setOpenList] = React.useState(false);
  const [isPending, startCreateTransition] = useTransition();
  const [selected, setSelected] = React.useState<Data[]>([]);
  const [selectedRecords, setSelectedRecords] = React.useState<Data[]>([]);
  const onSubmit = (values: DisciplineRecordSchema) => {
    startCreateTransition(async () => {
      if (selected.length === 0 || selectedRecords.length === 0) {
        toast.error('Vui lòng chọn loại đánh giá và cán bộ');
      }
      const disciplines = _.chain(selectedRecords)
        .groupBy('value')
        .map(item => {
          return {
            recordId: item[0].value,
            disciplineType: item.map(ele => ele.id),
          };
        })
        .value();

      const mappedValue = disciplines.map(item => {
        return {
          ...values,
          recordId: item.recordId,
          disciplineType: item.disciplineType,
        };
      });
      const { error } = await createDisciplines(mappedValue);
      if (!error) {
        toast.success('Tạo mới thành công');
      } else {
        toast.error('Tạo mới thất bại');
      }
    });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8 "
      >
        <Collapsible onOpenChange={setOpenForm} defaultOpen className="mb-5">
          <CollapsibleTrigger className="mb-3 flex w-full flex-row items-center justify-between rounded-md bg-muted p-2 text-card-foreground">
            Thông tin quyết định
            {openForm ? (
              <ChevronDown className="size-5" />
            ) : (
              <ChevronUp className="size-5" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="CollapsibleContent px-5">
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2 ">
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
                      <Input {...field} placeholder="Cơ quan quyết định" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CollapsibleContent>
        </Collapsible>
        <Collapsible
          onOpenChange={setOpenList}
          defaultOpen
          className="mb-5 overflow-visible"
        >
          <CollapsibleTrigger className="mb-3 flex w-full flex-row items-center justify-between rounded-md bg-muted p-2 text-card-foreground">
            Danh sách khen thưởng
            {openList ? (
              <ChevronDown className="size-5" />
            ) : (
              <ChevronUp className="size-5" />
            )}
          </CollapsibleTrigger>

          <CollapsibleContent className="CollapsibleContent overflow-visible px-5">
            <FancyMultiCombobox
              className="mt-3"
              selected={selected}
              setSelected={setSelected}
              callback={setSelectedRecords}
              id="*"
              placeholder="Loại kỷ luật"
              dataset={enumDisciplineType.map(ele => ({
                value: ele,
                label: ele,
              }))}
            />

            {selected.map(item => (
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
            ))}
            <Button type="submit" className="mt-5" disabled={isPending}>
              {isPending ? (
                <ReloadIcon
                  className="mr-2 size-4 animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <SaveIcon className="mr-2 size-4" aria-hidden="true" />
              )}
              Lưu
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </form>
    </Form>
  );
}
