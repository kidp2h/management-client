import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateProfession } from '@/db/actions/profession';
import { updateProfessionSchema } from '@/lib/zod/schemas/record-schema';

export interface UpdateProfessionFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateProfessionSchema>>;
  data: any;
}
export default function UpdateProfessionForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateProfessionFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updateProfessionSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateProfession({
            id: data.id,
            ...values,
          });
          console.error(error);
          if (error) {
            toast.error('Cập nhật quá trình bồi dưỡng nghiệp vụ thất bại');
            return;
          }
          onSuccess();
          toast.success('Quá trình bồi dưỡng nghiệp vụ đã được cập nhật');
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
