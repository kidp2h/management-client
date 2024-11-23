import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createPolicyObject } from '@/db/actions/policy-objects';
import { createPolicyObjectSchema } from '@/lib/zod/schemas/policy-object-schema';

export interface CreatePolicyObjectFormProps {
  onSuccess: () => void;
}
export default function CreatePolicyObjectForm({
  onSuccess,
}: CreatePolicyObjectFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createPolicyObject(values);
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Quân hàm đã được tạo');
        });
      }}
      formSchema={createPolicyObjectSchema}
      fieldConfig={{
        name: {
          inputProps: {
            type: 'text',
            placeholder: 'Tên quân hàm',
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
