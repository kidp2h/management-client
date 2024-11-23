import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createAppellation } from '@/db/actions/appellations';
import { createAppellationSchema } from '@/lib/zod/schemas/appellation-schema';

export interface CreateAppellationFormProps {
  onSuccess: () => void;
}
export default function CreateAppellationForm({
  onSuccess,
}: CreateAppellationFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createAppellation(values);
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Danh hiệu đã được tạo');
        });
      }}
      formSchema={createAppellationSchema}
      fieldConfig={{
        name: {
          inputProps: {
            type: 'text',
            placeholder: 'Tên danh hiệu',
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
