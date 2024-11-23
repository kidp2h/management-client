import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createLanguageCertification } from '@/db/actions/language-certifications';
import { createLanguageCertificationSchema } from '@/lib/zod/schemas/language-certification-schema';

export interface CreateLanguageCertificationFormProps {
  onSuccess: () => void;
}
export default function CreateLanguageCertificationForm({
  onSuccess,
}: CreateLanguageCertificationFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createLanguageCertification(values);
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Chứng chỉ đã được tạo');
        });
      }}
      formSchema={createLanguageCertificationSchema}
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
