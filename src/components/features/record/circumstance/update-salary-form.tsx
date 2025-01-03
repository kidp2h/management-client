import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateSalary } from '@/db/actions/progress-salaries';
import { updateSalarySchema } from '@/lib/zod/schemas/record-schema';

export interface UpdateSalaryFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateSalarySchema>>;
  data: any;
}
export default function UpdateSalaryForm({
  onSuccess,
  fieldConfig,
  data,
  ...props
}: UpdateSalaryFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  const { salaryGrades } = (props as any).salaryGrades;
  const { civilServantRanks } = (props as any).civilServantRanks;
  const { publicEmployeeRanks } = (props as any).publicEmployeeRanks;
  return (
    <AutoForm
      formSchema={updateSalarySchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateSalary({
            id: data.id,
            ...values,
          });
          console.error(error);
          if (error) {
            toast.error('Cập nhật quá trình lương thất bại');
            return;
          }
          onSuccess();
          toast.success('Quá trình lương đã được cập nhật');
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
