import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateRole } from '@/db/actions/roles';
import { updateRoleSchema } from '@/lib/zod/schemas/role-schema';

export interface UpdateRoleFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateRoleSchema>>;
  data: any;
}
export default function UpdateRoleForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateRoleFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updateRoleSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateRole({
            id: data.id,
            ...values,
          });
          if (error) {
            toast.error('Cập nhật vai trò thất bại');
            return;
          }
          onSuccess();
          toast.success('Vai trò đã được cập nhật');
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
