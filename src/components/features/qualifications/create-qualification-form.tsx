import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createQualification } from '@/db/actions/qualifications';
import { createQualificationSchema } from '@/lib/zod/schemas/qualification-schema';

export interface CreateQualificationFormProps {
  onSuccess: () => void;
}
export default function CreateQualificationForm({
  onSuccess,
}: CreateQualificationFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createQualification(values);
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Trình độ chuyên môn đã được tạo');
        });
      }}
      formSchema={createQualificationSchema}
      fieldConfig={{
        name: {
          inputProps: {
            type: 'text',
            placeholder: 'Trình độ chuyên môn',
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
