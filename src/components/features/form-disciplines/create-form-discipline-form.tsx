import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createFormDiscipline } from '@/db/actions/form-disciplines';
import { createFormDisciplineSchema } from '@/lib/zod/schemas/form-discipline-schema';

export interface CreateFormDisciplineFormProps {
  onSuccess: () => void;
}
export default function CreateFormDisciplineForm({
  onSuccess,
}: CreateFormDisciplineFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createFormDiscipline(values);
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Hình thức kỷ luật đã được tạo');
        });
      }}
      formSchema={createFormDisciplineSchema}
      fieldConfig={{
        name: {
          inputProps: {
            type: 'text',
            placeholder: 'Hình thức kỷ luật',
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
