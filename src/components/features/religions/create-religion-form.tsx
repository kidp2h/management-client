import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createReligion } from '@/db/actions/religions';
import { createReligionSchema } from '@/lib/zod/schemas/religions-schema';

export interface CreateReligionFormProps {
  onSuccess: () => void;
}
export default function CreateReligionForm({
  onSuccess,
}: CreateReligionFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createReligion(values);
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Tôn giáo đã được tạo');
        });
      }}
      formSchema={createReligionSchema}
      fieldConfig={{
        name: {
          inputProps: {
            type: 'text',
            placeholder: 'Tên tôn giáo',
          },
        },
        code: {
          inputProps: {
            type: 'text',
            placeholder: 'Mã tôn giáo',
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
