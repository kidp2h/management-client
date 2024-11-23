import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createTechnologyCertification } from '@/db/actions/technology-certifications';
import { createTechnologyCertificationSchema } from '@/lib/zod/schemas/technology-certification-schema';

export interface CreateTechnologyCertificationFormProps {
  onSuccess: () => void;
}
export default function CreateTechnologyCertificationForm({
  onSuccess,
}: CreateTechnologyCertificationFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createTechnologyCertification(values);
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Chứng chỉ đã được tạo');
        });
      }}
      formSchema={createTechnologyCertificationSchema}
      fieldConfig={{
        name: {
          inputProps: {
            type: 'text',
            placeholder: 'Tên chứng chỉ',
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
