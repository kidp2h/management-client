import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createWorkExperience } from '@/db/actions/work-experiences';
import { createWorkExperienceSchema } from '@/lib/zod/schemas/record-schema';

export interface CreateWorkExperienceFormProps {
  onSuccess: () => void;
  recordId: string;
}
export default function CreateWorkExperienceForm({
  onSuccess,
  ...props
}: CreateWorkExperienceFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createWorkExperience({
            ...values,
            recordId: props.recordId,
          });
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Quá trình công tác đã được tạo');
        });
      }}
      formSchema={createWorkExperienceSchema}
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
