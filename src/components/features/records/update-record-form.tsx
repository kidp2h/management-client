import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateRecord } from '@/db/actions/records';
import { updateRecordSchema } from '@/lib/zod/schemas/record-schema';
import { useGlobalStore } from '@/providers/global-store-provider';

export interface UpdateRecordFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<z.infer<ReturnType<typeof updateRecordSchema>>>;
  data: any;
}
export default function UpdateRecordForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateRecordFormProps) {
  const { religions, ranks } = useGlobalStore(state => state);
  const [isUpdatePending, startUpdateTransition] = useTransition();
  return (
    <AutoForm
      formSchema={updateRecordSchema(
        religions.map(rel => `${rel.id}|${rel.name}`),
        ranks.map(r => `${r.id}|${r.name}`),
      )}
      onSubmit={async values => {
        console.log(values);
        startUpdateTransition(async () => {
          const { error } = await updateRecord({
            id: data.id,
            ...values,
            religionId: values.religionId?.split('|')[0] || data.religionId,
            rankId: values.rankId?.split('|')[0] || data.rankId,
          });
          if (error) {
            toast.error('Cập nhật hồ sơ thất bại');
            return;
          }
          onSuccess();
          toast.success('Hồ sơ đã được cập nhật');
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
