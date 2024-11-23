import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createPartyCommittee } from '@/db/actions/party-committees';
import { createPartyCommitteeSchema } from '@/lib/zod/schemas/party-committee-schema';

export interface CreatePartyCommitteeFormProps {
  onSuccess: () => void;
}
export default function CreatePartyCommitteeForm({
  onSuccess,
}: CreatePartyCommitteeFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createPartyCommittee(values);
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Quân hàm đã được tạo');
        });
      }}
      formSchema={createPartyCommitteeSchema}
      fieldConfig={{
        name: {
          inputProps: {
            type: 'text',
            placeholder: 'Tên quân hàm',
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
