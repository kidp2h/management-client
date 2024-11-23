import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateFormCommendation } from '@/db/actions/form-commendations';
import { updateFormCommendationSchema } from '@/lib/zod/schemas/form-commendation-schema';

export interface UpdateFormCommendationFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateFormCommendationSchema>>;
  data: any;
}
export default function UpdateFormCommendationForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateFormCommendationFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updateFormCommendationSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateFormCommendation({
            id: data.id,
            ...values,
          });
          if (error) {
            toast.error('Cập nhật hình thức khen thưởng thất bại');
            return;
          }
          onSuccess();
          toast.success('Hình thức khen thưởng đã được cập nhật');
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
