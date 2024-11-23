import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createSalary } from '@/db/actions/salaries';
import { createSalarySchema } from '@/lib/zod/schemas/salary-schema';
import { getAllSalaryGrades } from '@/db/queries/salary-grades';

export interface CreateSalaryFormProps {
  onSuccess: () => void;
  grades: ReturnType<typeof getAllSalaryGrades>;
}
export default function CreateSalaryForm({
  onSuccess,
  grades,
}: CreateSalaryFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  const { data } = React.use(grades);
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createSalary(values);
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Lương đã được tạo');
        });
      }}
      formSchema={createSalarySchema(data?.map(grade => grade.name) || [])}
      fieldConfig={{}}
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
