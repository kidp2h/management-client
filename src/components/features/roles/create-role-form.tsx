import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createRole } from '@/db/actions/roles';
import { createRoleSchema } from '@/lib/zod/schemas/role-schema';

export interface CreateRoleFormProps {
  onSuccess: () => void;
}
export default function CreateRoleForm({ onSuccess }: CreateRoleFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createRole(values);
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Vai trò đã được tạo');
        });
      }}
      formSchema={createRoleSchema}
      fieldConfig={{
        name: {
          inputProps: {
            type: 'text',
            placeholder: 'Tên vai trò',
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
