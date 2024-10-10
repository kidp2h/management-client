import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateRank } from '@/db/actions/ranks';
import { updateRankSchema } from '@/lib/zod/schemas/rank-schema';

export interface UpdateRankFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateRankSchema>>;
  data: any;
}
export default function UpdateRankForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateRankFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updateRankSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateRank({
            id: data.id,
            ...values,
          });
          if (error) {
            toast.error('Cập nhật cấp bậc thất bại');
            return;
          }
          onSuccess();
          toast.success('Cấp bậc đã được cập nhật');
        });
      }}
      fieldConfig={fieldConfig}
    >
      <AutoFormSubmit
        disabled={isUpdatePending}
        className="w-full bg-primary text-primary-foreground"
      >
        {isUpdatePending && (
          <ReloadIcon className="mr-2 size-4 animate-spin" aria-hidden="true" />
        )}
        Lưu thay đổi
      </AutoFormSubmit>
    </AutoForm>
  );
}
