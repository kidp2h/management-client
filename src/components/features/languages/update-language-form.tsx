import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateLanguage } from '@/db/actions/languages';
import { updateLanguageSchema } from '@/lib/zod/schemas/language-schema';

export interface UpdateLanguageFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateLanguageSchema>>;
  data: any;
}
export default function UpdateLanguageForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateLanguageFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updateLanguageSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateLanguage({
            id: data.id,
            ...values,
          });
          if (error) {
            toast.error('Cập nhật ngôn ngữ thất bại');
            return;
          }
          onSuccess();
          toast.success('Ngôn ngữ đã được cập nhật');
        });
      }}
      fieldConfig={fieldConfig}
    >
      <AutoFormSubmit
        disabled={isUpdatePending}
        className="w-full bg-primary text-primary-foreground"
      >
        {isUpdatePending && (
          <ReloadIcon className="mr-2 size-4 animate-spin" aria-hidden="true" />
        )}
        Lưu thay đổi
      </AutoFormSubmit>
    </AutoForm>
  );
}
