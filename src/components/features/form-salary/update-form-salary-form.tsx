import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateFormSalary } from '@/db/actions/form-salary';
import { updateFormSalarySchema } from '@/lib/zod/schemas/form-salary-schema';

export interface UpdateFormSalaryFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateFormSalarySchema>>;
  data: any;
}
export default function UpdateFormSalaryForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateFormSalaryFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updateFormSalarySchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateFormSalary({
            id: data.id,
            ...values,
          });
          if (error) {
            toast.error('Cập nhật hình thức hưởng lương thất bại');
            return;
          }
          onSuccess();
          toast.success('Hình thức hưởng lương đã được cập nhật');
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
