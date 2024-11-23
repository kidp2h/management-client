import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateOldRegime } from '@/db/actions/old-regimes';
import { updateOldRegimeSchema } from '@/lib/zod/schemas/record-schema';

export interface UpdateOldRegimeFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateOldRegimeSchema>>;
  data: any;
}
export default function UpdateOldRegimeForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateOldRegimeFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updateOldRegimeSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateOldRegime({
            id: data.id,
            ...values,
          });
          console.log(values, data);
          console.error(error);
          if (error) {
            toast.error('Cập nhật lịch sử cá nhân thất bại');
            return;
          }
          onSuccess();
          toast.success('Lịch sử cá nhân đã được cập nhật');
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
