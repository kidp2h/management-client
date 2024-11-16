import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateWorkExperience } from '@/db/actions/work-experiences';
import { updateWorkExperienceSchema } from '@/lib/zod/schemas/record-schema';

export interface UpdateWorkExperienceFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateWorkExperienceSchema>>;
  data: any;
}
export default function UpdateWorkExperienceForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateWorkExperienceFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updateWorkExperienceSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateWorkExperience({
            id: data.id,
            ...values,
          });
          console.error(error);
          if (error) {
            toast.error('Cập nhật quá trình công tác thất bại');
            return;
          }
          onSuccess();
          toast.success('Quá trình công tác đã được cập nhật');
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
