import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateEthnicity } from '@/db/actions/ethnicities';
import { updateEthnicitySchema } from '@/lib/zod/schemas/ethnicity-schema';

export interface UpdateEthnicityFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateEthnicitySchema>>;
  data: any;
}
export default function UpdateEthnicityForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateEthnicityFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updateEthnicitySchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateEthnicity({
            id: data.id,
            ...values,
          });
          if (error) {
            toast.error('Cập nhật dân tộc thất bại');
            return;
          }
          onSuccess();
          toast.success('Dân tộc đã được cập nhật');
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
