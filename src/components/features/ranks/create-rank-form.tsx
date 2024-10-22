import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createRank } from '@/db/actions/ranks';
import { createRankSchema } from '@/lib/zod/schemas/rank-schema';

export interface CreateRankFormProps {
  onSuccess: () => void;
}
export default function CreateRankForm({ onSuccess }: CreateRankFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createRank(values);
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Cấp bậc đã được tạo');
        });
      }}
      formSchema={createRankSchema}
      fieldConfig={{
        name: {
          inputProps: {
            type: 'text',
            placeholder: 'Tên cấp bậc',
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
