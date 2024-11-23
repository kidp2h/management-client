import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createAcademicQualification } from '@/db/actions/academic-qualifications';
import { createAcademicQualificationSchema } from '@/lib/zod/schemas/academic-qualification-schema';

export interface CreateAcademicQualificationFormProps {
  onSuccess: () => void;
}
export default function CreateAcademicQualificationForm({
  onSuccess,
}: CreateAcademicQualificationFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createAcademicQualification(values);
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Học hàm đã được tạo');
        });
      }}
      formSchema={createAcademicQualificationSchema}
      fieldConfig={{
        name: {
          inputProps: {
            type: 'text',
            placeholder: 'Học hàm',
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
