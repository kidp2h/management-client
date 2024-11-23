import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateFormTraining } from '@/db/actions/form-trainings';
import { updateFormTrainingSchema } from '@/lib/zod/schemas/form-training-schema';

export interface UpdateFormTrainingFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateFormTrainingSchema>>;
  data: any;
}
export default function UpdateFormTrainingForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateFormTrainingFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updateFormTrainingSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateFormTraining({
            id: data.id,
            ...values,
          });
          if (error) {
            toast.error('Cập nhật hình thức đào tạo thất bại');
            return;
          }
          onSuccess();
          toast.success('Hình thức đào tạo đã được cập nhật');
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
