import React from 'react';

import FormTrainingsManagementSection from '@/components/features/form-trainings/form-trainings-management-section';
import { getFormTrainings } from '@/db/queries/form-trainings';
import { getFormTrainingsSchema } from '@/lib/zod/schemas/form-training-schema';
import type { SearchParams } from '@/types';

export interface FormTrainingsManagementPageProps {
  searchParams: SearchParams;
}
export default async function FormTrainingsManagementPage({
  searchParams,
}: FormTrainingsManagementPageProps) {
  const search = getFormTrainingsSchema.parse(searchParams);

  const formTrainings = getFormTrainings(search);

  return <FormTrainingsManagementSection formTrainings={formTrainings} />;
}
