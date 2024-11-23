import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createPublicEmployeeRank } from '@/db/actions/public-employee-ranks';
import { createPublicEmployeeRankSchema } from '@/lib/zod/schemas/public-employee-rank-schema';

export interface CreatePublicEmployeeRankFormProps {
  onSuccess: () => void;
}
export default function CreatePublicEmployeeRankForm({
  onSuccess,
}: CreatePublicEmployeeRankFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createPublicEmployeeRank(values);
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Ngạch viên chức đã được tạo');
        });
      }}
      formSchema={createPublicEmployeeRankSchema}
      fieldConfig={{
        name: {
          inputProps: {
            type: 'text',
            placeholder: 'Ngạch viên chức',
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
