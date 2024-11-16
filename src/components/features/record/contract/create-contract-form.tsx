import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createContract } from '@/db/actions/records';
import { createContractSchema } from '@/lib/zod/schemas/record-schema';

export interface CreateContractFormProps {
  onSuccess: () => void;
  recordId: string;
}
export default function CreateContractForm({
  onSuccess,
  ...props
}: CreateContractFormProps) {
  console.log(props);
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createContract({
            ...values,
            recordId: props.recordId,
          });
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Hợp đồng đã được tạo');
        });
      }}
      formSchema={createContractSchema}
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
