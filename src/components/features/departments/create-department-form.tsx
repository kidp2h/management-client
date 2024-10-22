import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createDepartment } from '@/db/actions/departments';
import { createDepartmentSchema } from '@/lib/zod/schemas/department-schema';

export interface CreateDepartmentFormProps {
  onSuccess: () => void;
}
export default function CreateDepartmentForm({
  onSuccess,
}: CreateDepartmentFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createDepartment(values);
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Tôn giáo đã được tạo');
        });
      }}
      formSchema={createDepartmentSchema}
      fieldConfig={{
        name: {
          inputProps: {
            type: 'text',
            placeholder: 'Tên tôn giáo',
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
