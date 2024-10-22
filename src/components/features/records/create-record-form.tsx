import { ReloadIcon } from '@radix-ui/react-icons';
import { CaseUpper } from 'lucide-react';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import { createRecord } from '@/db/actions/records';
import { createRecordSchema } from '@/lib/zod/schemas/record-schema';
import { useGlobalStore } from '@/providers/global-store-provider';

export interface CreateRecordFormProps {
  onSuccess: () => void;
}
export default function CreateRecordForm({ onSuccess }: CreateRecordFormProps) {
  const [isCreatePending, startCreateTransition] = useTransition();
  const { ranks } = useGlobalStore(state => state);
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          if (!values.religion || !values.rankId) {
            toast.error('Vui lòng chọn tôn giáo và cấp bậc');
            return;
          }
          const { error } = await createRecord({
            ...values,
            religion: values.religion.split('|')[0],
            rankId: values.rankId.split('|')[0],
          });
          if (error) {
            toast.error(error);
            return;
          }
          onSuccess();
          toast.success('Hồ sơ đã được tạo');
        });
      }}
      formSchema={createRecordSchema(ranks.map(r => `${r.id}|${r.name}`))}
      fieldConfig={{
        fullName: {
          icon: CaseUpper,
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
