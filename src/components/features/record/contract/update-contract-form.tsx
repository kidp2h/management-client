import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateContract } from '@/db/actions/records';
import { updateContractSchema } from '@/lib/zod/schemas/record-schema';

export interface UpdateContractFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateContractSchema>>;
  data: any;
}
export default function UpdateContractForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateContractFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updateContractSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateContract({
            id: data.id,
            ...values,
          });
          // console.log(values, data);
          console.error(error);
          if (error) {
            toast.error('Cập nhật hợp đồng thất bại');
            return;
          }
          onSuccess();
          toast.success('Hợp đồng đã được cập nhật');
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
