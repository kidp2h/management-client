import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateAllowance } from '@/db/actions/allowance';
import { updateAllowanceSchema } from '@/lib/zod/schemas/record-schema';

export interface UpdateAllowanceFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateAllowanceSchema>>;
  data: any;
}
export default function UpdateAllowanceForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateAllowanceFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updateAllowanceSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateAllowance({
            id: data.id,
            ...values,
          });
          console.error(error);
          if (error) {
            toast.error('Cập nhật quá trình trợ cấp thất bại');
            return;
          }
          onSuccess();
          toast.success('Quá trình trợ cấp đã được cập nhật');
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
