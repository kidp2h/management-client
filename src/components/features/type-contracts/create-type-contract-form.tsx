import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createTypeContract } from '@/db/actions/type-contracts';
import { createTypeContractSchema } from '@/lib/zod/schemas/type-contract-schema';

export interface CreateTypeContractFormProps {
  onSuccess: () => void;
}
export default function CreateTypeContractForm({
  onSuccess,
}: CreateTypeContractFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createTypeContract(values);
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Loại hợp đồng đã được tạo');
        });
      }}
      formSchema={createTypeContractSchema}
      fieldConfig={{
        name: {
          inputProps: {
            type: 'text',
            placeholder: 'Loại hợp đồng',
          },
        },
      }}
    >
      <AutoFormSubmit
        disabled={isCreatePending}
        className="w-full bg-primary text-primary-foreground"
      >
        {isCreatePending && (
          <ReloadIcon className="mr-2 size-4 animate-spin" aria-hidden="true" />
        )}
        Tạo
      </AutoFormSubmit>
    </AutoForm>
  );
}
