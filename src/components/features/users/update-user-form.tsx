import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateUser } from '@/lib/clerk';
import { updateUserSchema } from '@/lib/zod/schemas/user-schema';

export interface UpdateUserFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateUserSchema>>;
  data: any;
}
export default function UpdateUserForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateUserFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();
  return (
    <AutoForm
      formSchema={updateUserSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          try {
            await updateUser({
              id: data.id,
              ...values,
            });
            onSuccess();
            toast.success('Tài khoản đã được cập nhật');
          } catch (error) {
            console.log(error);
            toast.error('Cập nhật tài khoản thất bại');
          }
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
