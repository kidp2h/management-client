import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createLanguage } from '@/db/actions/languages';
import { createLanguageSchema } from '@/lib/zod/schemas/language-schema';

export interface CreateLanguageFormProps {
  onSuccess: () => void;
}
export default function CreateLanguageForm({
  onSuccess,
}: CreateLanguageFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createLanguage(values);
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Ngôn ngữ đã được tạo');
        });
      }}
      formSchema={createLanguageSchema}
      fieldConfig={{
        name: {
          inputProps: {
            type: 'text',
            placeholder: 'Ngôn ngữ',
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
