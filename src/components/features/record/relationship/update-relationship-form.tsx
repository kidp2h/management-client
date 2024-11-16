import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateRelationship } from '@/db/actions/relationships';
import { updateRelationshipSchema } from '@/lib/zod/schemas/record-schema';

export interface UpdateRelationshipFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateRelationshipSchema>>;
  data: any;
}
export default function UpdateRelationshipForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateRelationshipFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updateRelationshipSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateRelationship({
            id: data.id,
            ...values,
          });
          console.error(error);
          if (error) {
            toast.error('Cập nhật mối quan hệ thất bại');
            return;
          }
          onSuccess();
          toast.success('Mối quan hệ đã được cập nhật');
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
