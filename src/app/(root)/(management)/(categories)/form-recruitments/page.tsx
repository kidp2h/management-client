import React from 'react';

import FormRecruitmentsManagementSection from '@/components/features/form-recruitments/form-recruitments-management-section';
import { getFormRecruitments } from '@/db/queries/form-recruitments';
import { getFormRecruitmentsSchema } from '@/lib/zod/schemas/form-recruitment-schema';
import type { SearchParams } from '@/types';

export interface FormRecruitmentsManagementPageProps {
  searchParams: SearchParams;
}
export default async function FormRecruitmentsManagementPage({
  searchParams,
}: FormRecruitmentsManagementPageProps) {
  const search = getFormRecruitmentsSchema.parse(searchParams);

  const formRecruitments = getFormRecruitments(search);

  return (
    <FormRecruitmentsManagementSection formRecruitments={formRecruitments} />
  );
}
