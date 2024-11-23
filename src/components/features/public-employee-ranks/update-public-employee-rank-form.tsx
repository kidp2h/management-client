import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updatePublicEmployeeRank } from '@/db/actions/public-employee-ranks';
import { updatePublicEmployeeRankSchema } from '@/lib/zod/schemas/public-employee-rank-schema';

export interface UpdatePublicEmployeeRankFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updatePublicEmployeeRankSchema>>;
  data: any;
}
export default function UpdatePublicEmployeeRankForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdatePublicEmployeeRankFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updatePublicEmployeeRankSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updatePublicEmployeeRank({
            id: data.id,
            ...values,
          });
          if (error) {
            toast.error('Cập nhật gia đình xuất thân thất bại');
            return;
          }
          onSuccess();
          toast.success('Ngạch viên chức đã được cập nhật');
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
