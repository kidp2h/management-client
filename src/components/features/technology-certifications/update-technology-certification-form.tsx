import { ReloadIcon } from '@radix-ui/react-icons';
import React, { useTransition } from 'react';
import { toast } from 'sonner';
import type { z } from 'zod';

import AutoForm, { AutoFormSubmit } from '@/components/ui/auto-form';
import type { FieldConfig } from '@/components/ui/auto-form/types';
import { updateTechnologyCertification } from '@/db/actions/technology-certifications';
import { updateTechnologyCertificationSchema } from '@/lib/zod/schemas/technology-certification-schema';

export interface UpdateTechnologyCertificationFormProps {
  onSuccess: () => void;
  fieldConfig?: FieldConfig<
    z.infer<typeof updateTechnologyCertificationSchema>
  >;
  data: any;
}
export default function UpdateTechnologyCertificationForm({
  onSuccess,
  fieldConfig,
  data,
}: UpdateTechnologyCertificationFormProps) {
  const [isUpdatePending, startUpdateTransition] = useTransition();

  return (
    <AutoForm
      formSchema={updateTechnologyCertificationSchema}
      onSubmit={async values => {
        startUpdateTransition(async () => {
          const { error } = await updateTechnologyCertification({
            id: data.id,
            ...values,
          });
          if (error) {
            toast.error('Cập nhật chứng chỉ thất bại');
            return;
          }
          onSuccess();
          toast.success('Chứng chỉ đã được cập nhật');
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
