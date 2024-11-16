import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateDepartment } from '@/db/actions/departments';
import { updateDepartmentSchema } from '@/lib/zod/schemas/department-schema';

export interface UpdateDepartmentFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateDepartmentSchema>>;
  data: any;
}
export default function UpdateDepartmentForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateDepartmentFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updateDepartmentSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateDepartment({
            id: data.id,
            ...values,
          });
          if (error) {
            toast.error('Cập nhật đơn vị thất bại');
            return;
          }
          onSuccess();
          toast.success('Đơn vị đã được cập nhật');
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
