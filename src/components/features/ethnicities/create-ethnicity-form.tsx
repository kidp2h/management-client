import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createEthnicity } from '@/db/actions/ethnicities';
import { createEthnicitySchema } from '@/lib/zod/schemas/ethnicity-schema';

export interface CreateEthnicityFormProps {
  onSuccess: () => void;
}
export default function CreateEthnicityForm({
  onSuccess,
}: CreateEthnicityFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createEthnicity(values);
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Dân tộc đã được tạo');
        });
      }}
      formSchema={createEthnicitySchema}
      fieldConfig={{
        name: {
          inputProps: {
            type: 'text',
            placeholder: 'Tên dân tộc',
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
