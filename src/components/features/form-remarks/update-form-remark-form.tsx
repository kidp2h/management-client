import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateFormRemark } from '@/db/actions/form-remarks';
import { updateFormRemarkSchema } from '@/lib/zod/schemas/form-remark-schema';

export interface UpdateFormRemarkFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateFormRemarkSchema>>;
  data: any;
}
export default function UpdateFormRemarkForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateFormRemarkFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updateFormRemarkSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateFormRemark({
            id: data.id,
            ...values,
          });
          if (error) {
            toast.error('Cập nhật hình thức đánh giá thất bại');
            return;
          }
          onSuccess();
          toast.success('Hình thức đánh giá đã được cập nhật');
        });
      }}
      fieldConfig={fieldConfig}
    >
      <AutoFormSubmit
        disabled={isUpdatePending}
        className="w-full bg-primary text-primary-foreground"
      >
        {isUpdatePending && (
          <ReloadIcon className="mr-2 size-4 animate-spin" aria-hidden="true" />
        )}
        Lưu thay đổi
      </AutoFormSubmit>
    </AutoForm>
  );
}
