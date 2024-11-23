import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updatePolicyObject } from '@/db/actions/policy-objects';
import { updatePolicyObjectSchema } from '@/lib/zod/schemas/policy-object-schema';

export interface UpdatePolicyObjectFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updatePolicyObjectSchema>>;
  data: any;
}
export default function UpdatePolicyObjectForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdatePolicyObjectFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updatePolicyObjectSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updatePolicyObject({
            id: data.id,
            ...values,
          });
          if (error) {
            toast.error('Cập nhật quân hàm thất bại');
            return;
          }
          onSuccess();
          toast.success('Quân hàm đã được cập nhật');
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
