import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateSalary } from '@/db/actions/salaries';
import { updateSalarySchema } from '@/lib/zod/schemas/salary-schema';

export interface UpdateSalaryFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<ReturnType<typeof updateSalarySchema>>>;
  data: any;
}
export default function UpdateSalaryForm({
  onSuccess,
  fieldConfig,
  data,
  ...props
}: UpdateSalaryFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();
  return (
    <AutoForm
      formSchema={updateSalarySchema(
        (props as any)?.grades.map(grade => grade.name) || [],
      )}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateSalary({
            id: data.id,
            ...values,
          });
          if (error) {
            toast.error('Cập nhật lương thất bại');
            return;
          }
          onSuccess();
          toast.success('Lương đã được cập nhật');
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
