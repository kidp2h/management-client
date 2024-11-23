import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateFormRecruitment } from '@/db/actions/form-recruitments';
import { updateFormRecruitmentSchema } from '@/lib/zod/schemas/form-recruitment-schema';

export interface UpdateFormRecruitmentFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateFormRecruitmentSchema>>;
  data: any;
}
export default function UpdateFormRecruitmentForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateFormRecruitmentFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updateFormRecruitmentSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateFormRecruitment({
            id: data.id,
            ...values,
          });
          if (error) {
            toast.error('Cập nhật hình thức tuyển dụng thất bại');
            return;
          }
          onSuccess();
          toast.success('Hình thức tuyển dụng đã được cập nhật');
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
