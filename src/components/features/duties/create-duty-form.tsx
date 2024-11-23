import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createDuty } from '@/db/actions/duties';
import { createDutySchema } from '@/lib/zod/schemas/duty-schema';

export interface CreateDutyFormProps {
  onSuccess: () => void;
}
export default function CreateDutyForm({ onSuccess }: CreateDutyFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createDuty(values);
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Chức vụ đã được tạo');
        });
      }}
      formSchema={createDutySchema}
      fieldConfig={{
        name: {
          inputProps: {
            type: 'text',
            placeholder: 'Tên chức vụ',
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
