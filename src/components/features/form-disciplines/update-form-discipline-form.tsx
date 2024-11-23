import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateFormDiscipline } from '@/db/actions/form-disciplines';
import { updateFormDisciplineSchema } from '@/lib/zod/schemas/form-discipline-schema';

export interface UpdateFormDisciplineFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateFormDisciplineSchema>>;
  data: any;
}
export default function UpdateFormDisciplineForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateFormDisciplineFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updateFormDisciplineSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateFormDiscipline({
            id: data.id,
            ...values,
          });
          if (error) {
            toast.error('Cập nhật hình thức kỷ luật thất bại');
            return;
          }
          onSuccess();
          toast.success('Hình thức kỷ luật đã được cập nhật');
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
