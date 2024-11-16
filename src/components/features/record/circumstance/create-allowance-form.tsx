import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createAllowance } from '@/db/actions/allowance';
import { createAllowanceSchema } from '@/lib/zod/schemas/record-schema';

export interface CreateAllowanceFormProps {
  onSuccess: () => void;
  recordId: string;
}
export default function CreateAllowanceForm({
  onSuccess,
  ...props
}: CreateAllowanceFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createAllowance({
            ...values,
            recordId: props.recordId,
          });
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Quá trình phụ cấp đã được tạo');
        });
      }}
      formSchema={createAllowanceSchema}
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
