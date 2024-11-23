import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createOldRegime } from '@/db/actions/old-regimes';
import { createOldRegimeSchema } from '@/lib/zod/schemas/record-schema';

export interface CreateOldRegimeFormProps {
  onSuccess: () => void;
  recordId: string;
}
export default function CreateOldRegimeForm({
  onSuccess,
  ...props
}: CreateOldRegimeFormProps) {
  console.log(props);
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createOldRegime({
            ...values,
            recordId: props.recordId,
          });
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Dữ liệu đã được tạo');
        });
      }}
      formSchema={createOldRegimeSchema}
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
