import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updatePosition } from '@/db/actions/positions';
import { updatePositionSchema } from '@/lib/zod/schemas/position-schema';

export interface UpdatePositionFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updatePositionSchema>>;
  data: any;
}
export default function UpdatePositionForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdatePositionFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updatePositionSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updatePosition({
            id: data.id,
            ...values,
          });
          if (error) {
            toast.error('Cập nhật vị trí việc làm thất bại');
            return;
          }
          onSuccess();
          toast.success('Vị trí việc làm đã được cập nhật');
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
