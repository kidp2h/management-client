import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createFormTraining } from '@/db/actions/form-trainings';
import { createFormTrainingSchema } from '@/lib/zod/schemas/form-training-schema';

export interface CreateFormTrainingFormProps {
  onSuccess: () => void;
}
export default function CreateFormTrainingForm({
  onSuccess,
}: CreateFormTrainingFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createFormTraining(values);
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Hình thức đào tạo đã được tạo');
        });
      }}
      formSchema={createFormTrainingSchema}
      fieldConfig={{
        name: {
          inputProps: {
            type: 'text',
            placeholder: 'Hình thức đào tạo',
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
