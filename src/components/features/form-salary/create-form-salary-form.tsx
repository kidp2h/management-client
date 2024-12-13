import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createFormSalary } from '@/db/actions/form-salary';
import { createFormSalarySchema } from '@/lib/zod/schemas/form-salary-schema';

export interface CreateFormSalaryFormProps {
  onSuccess: () => void;
}
export default function CreateFormSalaryForm({
  onSuccess,
}: CreateFormSalaryFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createFormSalary(values);
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Hình thức hưởng lương đã được tạo');
        });
      }}
      formSchema={createFormSalarySchema}
      fieldConfig={{
        name: {
          inputProps: {
            type: 'text',
            placeholder: 'Hình thức hưởng lương',
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
