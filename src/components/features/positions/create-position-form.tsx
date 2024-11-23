import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createPosition } from '@/db/actions/positions';
import { createPositionSchema } from '@/lib/zod/schemas/position-schema';

export interface CreatePositionFormProps {
  onSuccess: () => void;
}
export default function CreatePositionForm({
  onSuccess,
}: CreatePositionFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createPosition(values);
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Vị trí việc làm đã được tạo');
        });
      }}
      formSchema={createPositionSchema}
      fieldConfig={{
        name: {
          inputProps: {
            type: 'text',
            placeholder: 'Tên vị trí việc làm',
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
