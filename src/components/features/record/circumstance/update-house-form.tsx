import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateHouse } from '@/db/actions/house';
import { updateHouseSchema } from '@/lib/zod/schemas/record-schema';

export interface UpdateHouseFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<typeof updateHouseSchema>>;
  data: any;
}
export default function UpdateHouseForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateHouseFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updateHouseSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateHouse({
            id: data.id,
            ...values,
          });
          console.error(error);
          if (error) {
            toast.error('Cập nhật nhà ở thất bại');
            return;
          }
          onSuccess();
          toast.success('Nhà ở đã được cập nhật');
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
