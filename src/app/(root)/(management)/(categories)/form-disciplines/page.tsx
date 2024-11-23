import React from 'react';

import FormDisciplinesManagementSection from '@/components/features/form-disciplines/form-disciplines-management-section';
import { getFormDisciplines } from '@/db/queries/form-disciplines';
import { getFormDisciplinesSchema } from '@/lib/zod/schemas/form-discipline-schema';
import type { SearchParams } from '@/types';

export interface FormDisciplinesManagementPageProps {
  searchParams: SearchParams;
}
export default async function FormDisciplinesManagementPage({
  searchParams,
}: FormDisciplinesManagementPageProps) {
  const search = getFormDisciplinesSchema.parse(searchParams);

  const formDisciplines = getFormDisciplines(search);

  return <FormDisciplinesManagementSection formDisciplines={formDisciplines} />;
}
