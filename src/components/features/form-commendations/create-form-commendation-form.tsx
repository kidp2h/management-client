import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createFormCommendation } from '@/db/actions/form-commendations';
import { createFormCommendationSchema } from '@/lib/zod/schemas/form-commendation-schema';

export interface CreateFormCommendationFormProps {
  onSuccess: () => void;
}
export default function CreateFormCommendationForm({
  onSuccess,
}: CreateFormCommendationFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createFormCommendation(values);
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Hình thức khen thưởng đã được tạo');
        });
      }}
      formSchema={createFormCommendationSchema}
      fieldConfig={{
        name: {
          inputProps: {
            type: 'text',
            placeholder: 'Hình thức khen thưởng',
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
