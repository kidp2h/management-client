import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateFamilyBackground } from '@/db/actions/family-backgrounds';
import { updateFamilyBackgroundSchema } from '@/lib/zod/schemas/family-background-schema';

export interface UpdateFamilyBackgroundFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateFamilyBackgroundSchema>>;
  data: any;
}
export default function UpdateFamilyBackgroundForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateFamilyBackgroundFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updateFamilyBackgroundSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateFamilyBackground({
            id: data.id,
            ...values,
          });
          if (error) {
            toast.error('Cập nhật gia đình xuất thân thất bại');
            return;
          }
          onSuccess();
          toast.success('Gia đình xuất thân đã được cập nhật');
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
