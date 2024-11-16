import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateTraining } from '@/db/actions/training';
import { updateTrainingSchema } from '@/lib/zod/schemas/record-schema';

export interface UpdateTrainingFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateTrainingSchema>>;
  data: any;
}
export default function UpdateTrainingForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateTrainingFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updateTrainingSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateTraining({
            id: data.id,
            ...values,
          });
          console.error(error);
          if (error) {
            toast.error('Cập nhật quá trình đào tạo chuyên môn thất bại');
            return;
          }
          onSuccess();
          toast.success('Quá trình đào tạo chuyên môn đã được cập nhật');
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
