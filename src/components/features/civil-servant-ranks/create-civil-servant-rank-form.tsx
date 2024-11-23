import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createCivilServantRank } from '@/db/actions/civil-servant-ranks';
import { createCivilServantRankSchema } from '@/lib/zod/schemas/civil-servant-rank-schema';

export interface CreateCivilServantRankFormProps {
  onSuccess: () => void;
}
export default function CreateCivilServantRankForm({
  onSuccess,
}: CreateCivilServantRankFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createCivilServantRank(values);
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Ngạch công chức đã được tạo');
        });
      }}
      formSchema={createCivilServantRankSchema}
      fieldConfig={{
        name: {
          inputProps: {
            type: 'text',
            placeholder: 'Ngạch công chức',
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
