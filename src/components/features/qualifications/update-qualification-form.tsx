import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateQualification } from '@/db/actions/qualifications';
import { updateQualificationSchema } from '@/lib/zod/schemas/qualification-schema';

export interface UpdateQualificationFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateQualificationSchema>>;
  data: any;
}
export default function UpdateQualificationForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateQualificationFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updateQualificationSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateQualification({
            id: data.id,
            ...values,
          });
          if (error) {
            toast.error('Cập nhật trình độ chuyên môn thất bại');
            return;
          }
          onSuccess();
          toast.success('Trình độ chuyên môn đã được cập nhật');
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
