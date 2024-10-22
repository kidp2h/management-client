import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createPermission } from '@/db/actions/permissions';
import { createPermissionSchema } from '@/lib/zod/schemas/permission-schema';

export interface CreatePermissionFormProps {
  onSuccess: () => void;
}
export default function CreatePermissionForm({
  onSuccess,
}: CreatePermissionFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createPermission(values);
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Quyền đã được tạo');
        });
      }}
      formSchema={createPermissionSchema}
      fieldConfig={{
        name: {
          inputProps: {
            type: 'text',
            placeholder: 'Tên quyền',
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
