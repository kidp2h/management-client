import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateTypeContract } from '@/db/actions/type-contracts';
import { updateTypeContractSchema } from '@/lib/zod/schemas/type-contract-schema';

export interface UpdateTypeContractFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateTypeContractSchema>>;
  data: any;
}
export default function UpdateTypeContractForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateTypeContractFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updateTypeContractSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateTypeContract({
            id: data.id,
            ...values,
          });
          if (error) {
            toast.error('Cập nhật loại hợp đồng thất bại');
            return;
          }
          onSuccess();
          toast.success('Loại hợp đồng đã được cập nhật');
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
