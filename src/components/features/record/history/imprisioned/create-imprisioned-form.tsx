import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createImprisioned } from '@/db/actions/imprisioned';
import { createImprisionedSchema } from '@/lib/zod/schemas/record-schema';

export interface CreateImprisionedFormProps {
  onSuccess: () => void;
  recordId: string;
}
export default function CreateImprisionedForm({
  onSuccess,
  ...props
}: CreateImprisionedFormProps) {
  // console.log(props);
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createImprisioned({
            ...values,
            recordId: props.recordId,
          });
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Lịch sử cá nhân đã được tạo');
        });
      }}
      formSchema={createImprisionedSchema}
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
