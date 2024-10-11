import { ReloadIcon } from '@radix-ui/react-icons';
import { CaseUpper, Code } from 'lucide-react';
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
  const { religions, ranks } = useGlobalStore(state => state);
  return (
    <AutoForm
      onSubmit={async values => {
        startCreateTransition(async () => {
          const { error } = await createRecord({
            ...values,
            religionId: values.religionId.split('|')[0],
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
      formSchema={createRecordSchema(
        religions.map(rel => `${rel.id}|${rel.name}`),
        ranks.map(r => `${r.id}|${r.name}`),
      )}
      fieldConfig={{
        code: {
          icon: Code,
        },
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
