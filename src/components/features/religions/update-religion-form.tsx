import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateReligion } from '@/db/actions/religions';
import { updateReligionSchema } from '@/lib/zod/schemas/religion-schema';

export interface UpdateReligionFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateReligionSchema>>;
  data: any;
}
export default function UpdateReligionForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateReligionFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updateReligionSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateReligion({
            id: data.id,
            ...values,
          });
          if (error) {
            toast.error('Cập nhật tôn giáo thất bại');
            return;
          }
          onSuccess();
          toast.success('Tôn giáo đã được cập nhật');
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
