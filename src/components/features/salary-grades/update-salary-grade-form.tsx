import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateSalaryGrade } from '@/db/actions/salary-grades';
import { updateSalaryGradeSchema } from '@/lib/zod/schemas/salary-grade-schema';

export interface UpdateSalaryGradeFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateSalaryGradeSchema>>;
  data: any;
}
export default function UpdateSalaryGradeForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateSalaryGradeFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updateSalaryGradeSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateSalaryGrade({
            id: data.id,
            ...values,
          });
          if (error) {
            toast.error('Cập nhật bậc lương thất bại');
            return;
          }
          onSuccess();
          toast.success('Bậc lương đã được cập nhật');
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
