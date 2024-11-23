import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateMilitaryRank } from '@/db/actions/military-ranks';
import { updateMilitaryRankSchema } from '@/lib/zod/schemas/military-rank-schema';

export interface UpdateMilitaryRankFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateMilitaryRankSchema>>;
  data: any;
}
export default function UpdateMilitaryRankForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateMilitaryRankFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updateMilitaryRankSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateMilitaryRank({
            id: data.id,
            ...values,
          });
          if (error) {
            toast.error('Cập nhật quân hàm thất bại');
            return;
          }
          onSuccess();
          toast.success('Quân hàm đã được cập nhật');
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
