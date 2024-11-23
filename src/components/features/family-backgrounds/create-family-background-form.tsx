import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createFamilyBackground } from '@/db/actions/family-backgrounds';
import { createFamilyBackgroundSchema } from '@/lib/zod/schemas/family-background-schema';

export interface CreateFamilyBackgroundFormProps {
  onSuccess: () => void;
}
export default function CreateFamilyBackgroundForm({
  onSuccess,
}: CreateFamilyBackgroundFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createFamilyBackground(values);
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Gia đình xuất thân đã được tạo');
        });
      }}
      formSchema={createFamilyBackgroundSchema}
      fieldConfig={{
        name: {
          inputProps: {
            type: 'text',
            placeholder: 'Tên gia đình xuất thân',
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
