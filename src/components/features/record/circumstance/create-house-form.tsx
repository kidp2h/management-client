import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import { createHouse } from '@/db/actions/houses';
import { createHouseSchema } from '@/lib/zod/schemas/record-schema';
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
import { Combobox } from '@/components/ui/combobox';
import { House, Scan } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { enumTypeHouse } from '@/db/schema';
import { useUploadFile } from '@/hooks/use-upload-file';
import { FileUploader } from '@/components/common/file-uploader';

export interface CreateHouseFormProps {
  onSuccess: () => void;
  recordId: string;
}
export default function CreateHouseForm({
  onSuccess,
  ...props
}: CreateHouseFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  const [loading, setLoading] = React.useState(false);
  const { onUpload, progresses, isUploading } = useUploadFile('imageUploader', {
    defaultUploadedFiles: [],
  });
  const form = useForm<z.infer<typeof createHouseSchema>>({
    defaultValues: {},
  });

  const onSubmit = (values: z.infer<typeof createHouseSchema>) => {
    startCreateTransition(async () => {
      setLoading(true);
      toast.promise(
        onUpload(values.files, async uploaded => {
          delete values.files;
          const { error } = await createHouse(
            {
              ...values,
              recordId: props.recordId,
            },
            uploaded,
          );
          if (error) {
            toast.error(error);
            return;
          }
          toast.success('Nhà ở đã được tạo');
          setLoading(false);
        }),
        {
          loading: 'Đang xử lý yêu cầu và tệp',
          success: () => {
            return 'Xử lý tệp thành công';
          },
          error: 'Xử lý yêu cầu thất bại',
        },
      );
      // const { error } = await createHouse({
      //   ...values,
      //   recordId: props.recordId,
      // });
      // if (error) {
      //   toast.error(error);
      //   return;
      // }
      // onSuccess();
      //
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
          name="typeHouse"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại nhà</FormLabel>
              <FormControl>
                <Combobox
                  type="form"
                  startIcon={House}
                  form={form}
                  placeholder="Chọn loại nhà"
                  field={field}
                  lazy={false}
                  dataset={enumTypeHouse.map(i => ({
                    label: i,
                    value: i,
                  }))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="area"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diện tích</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  inputMode="numeric"
                  startIcon={Scan}
                  pattern="[0-9]*"
                  unit="㎡"
                  placeholder="Diện tích"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="files"
          render={({ field }) => (
            <div className="row-start-11 space-y-6 pb-3 md:col-span-full ">
              <FormItem className="w-full ">
                <FormLabel>
                  Hình ảnh hoặc tài liệu chứng nhận sỡ hữu nhà ở
                </FormLabel>
                <FormControl>
                  <FileUploader
                    value={field.value}
                    onValueChange={field.onChange}
                    className="w-full"
                    maxFileCount={4}
                    maxSize={4 * 1024 * 1024}
                    progresses={progresses}
                    disabled={isUploading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
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
