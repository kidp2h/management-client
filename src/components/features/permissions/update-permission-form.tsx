import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updatePermission } from '@/db/actions/permissions';
import { updatePermissionSchema } from '@/lib/zod/schemas/permission-schema';

export interface UpdatePermissionFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updatePermissionSchema>>;
  data: any;
}
export default function UpdatePermissionForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdatePermissionFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updatePermissionSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updatePermission({
            id: data.id,
            ...values,
          });
          if (error) {
            toast.error('Cập nhật quyền thất bại');
            return;
          }
          onSuccess();
          toast.success('Quyền đã được cập nhật');
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
