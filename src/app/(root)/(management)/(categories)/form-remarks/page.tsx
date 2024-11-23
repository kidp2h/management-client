import React from 'react';

import FormRemarksManagementSection from '@/components/features/form-remarks/form-remarks-management-section';
import { getFormRemarks } from '@/db/queries/form-remarks';
import { getFormRemarksSchema } from '@/lib/zod/schemas/form-remark-schema';
import type { SearchParams } from '@/types';

export interface FormRemarksManagementPageProps {
  searchParams: SearchParams;
}
export default async function FormRemarksManagementPage({
  searchParams,
}: FormRemarksManagementPageProps) {
  const search = getFormRemarksSchema.parse(searchParams);

  const formRemarks = getFormRemarks(search);

  return <FormRemarksManagementSection formRemarks={formRemarks} />;
}
