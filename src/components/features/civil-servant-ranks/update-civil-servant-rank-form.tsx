import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateCivilServantRank } from '@/db/actions/civil-servant-ranks';
import { updateCivilServantRankSchema } from '@/lib/zod/schemas/civil-servant-rank-schema';

export interface UpdateCivilServantRankFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateCivilServantRankSchema>>;
  data: any;
}
export default function UpdateCivilServantRankForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateCivilServantRankFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updateCivilServantRankSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateCivilServantRank({
            id: data.id,
            ...values,
          });
          if (error) {
            toast.error('Cập nhật ngạch công chức thất bại');
            return;
          }
          onSuccess();
          toast.success('Ngạch công chức đã được cập nhật');
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
