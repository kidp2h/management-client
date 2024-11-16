import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createRelationship } from '@/db/actions/relationships';
import { createRelationshipSchema } from '@/lib/zod/schemas/record-schema';

export interface CreateRelationshipFormProps {
  onSuccess: () => void;
  recordId: string;
  type: string;
}
export default function CreateRelationshipForm({
  onSuccess,
  ...props
}: CreateRelationshipFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createRelationship({
            ...values,
            recordId: props.recordId,
            type: props.type,
          });
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Mối quan hệ đã được tạo');
        });
      }}
      formSchema={createRelationshipSchema}
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
