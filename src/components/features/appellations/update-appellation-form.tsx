import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateAppellation } from '@/db/actions/appellations';
import { updateAppellationSchema } from '@/lib/zod/schemas/appellation-schema';

export interface UpdateAppellationFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateAppellationSchema>>;
  data: any;
}
export default function UpdateAppellationForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateAppellationFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updateAppellationSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateAppellation({
            id: data.id,
            ...values,
          });
          if (error) {
            toast.error('Cập nhật danh hiệu thất bại');
            return;
          }
          onSuccess();
          toast.success('Danh hiệu đã được cập nhật');
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
