import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createOrganization } from '@/db/actions/organizations';
import { createOrganizationSchema } from '@/lib/zod/schemas/record-schema';

export interface CreateOrganizationFormProps {
  onSuccess: () => void;
  recordId: string;
}
export default function CreateOrganizationForm({
  onSuccess,
  ...props
}: CreateOrganizationFormProps) {
  console.log(props);
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createOrganization({
            ...values,
            recordId: props.recordId,
          });
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Dữ liệu được tạo');
        });
      }}
      formSchema={createOrganizationSchema}
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
