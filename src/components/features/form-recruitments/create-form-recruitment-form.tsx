import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createFormRecruitment } from '@/db/actions/form-recruitments';
import { createFormRecruitmentSchema } from '@/lib/zod/schemas/form-recruitment-schema';

export interface CreateFormRecruitmentFormProps {
  onSuccess: () => void;
}
export default function CreateFormRecruitmentForm({
  onSuccess,
}: CreateFormRecruitmentFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createFormRecruitment(values);
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Hình thức tuyển dụng đã được tạo');
        });
      }}
      formSchema={createFormRecruitmentSchema}
      fieldConfig={{
        name: {
          inputProps: {
            type: 'text',
            placeholder: 'Hình thức tuyển dụng',
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
