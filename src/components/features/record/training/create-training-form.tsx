import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createTraining } from '@/db/actions/training';
import { createTrainingSchema } from '@/lib/zod/schemas/record-schema';

export interface CreateTrainingFormProps {
  onSuccess: () => void;
  recordId: string;
}
export default function CreateTrainingForm({
  onSuccess,
  ...props
}: CreateTrainingFormProps) {
  console.log(props);
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createTraining({
            ...values,
            recordId: props.recordId,
          });
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Quá trình đào tạo chuyên môn đã được tạo');
        });
      }}
      formSchema={createTrainingSchema}
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
