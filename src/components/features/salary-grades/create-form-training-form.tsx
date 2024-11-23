import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createSalaryGrade } from '@/db/actions/salary-grades';
import { createSalaryGradeSchema } from '@/lib/zod/schemas/salary-grade-schema';

export interface CreateSalaryGradeFormProps {
  onSuccess: () => void;
}
export default function CreateSalaryGradeForm({
  onSuccess,
}: CreateSalaryGradeFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createSalaryGrade(values);
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Bậc lương đã được tạo');
        });
      }}
      formSchema={createSalaryGradeSchema}
      fieldConfig={{
        name: {
          inputProps: {
            type: 'text',
            placeholder: 'Bậc lương',
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
