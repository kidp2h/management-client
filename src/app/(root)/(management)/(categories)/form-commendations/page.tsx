import React from 'react';

import FormCommendationsManagementSection from '@/components/features/form-commendations/form-commendations-management-section';
import { getFormCommendations } from '@/db/queries/form-commendations';
import { getFormCommendationsSchema } from '@/lib/zod/schemas/form-commendation-schema';
import type { SearchParams } from '@/types';

export interface FormCommendationsManagementPageProps {
  searchParams: SearchParams;
}
export default async function FormCommendationsManagementPage({
  searchParams,
}: FormCommendationsManagementPageProps) {
  const search = getFormCommendationsSchema.parse(searchParams);

  const formCommendations = getFormCommendations(search);

  return (
    <FormCommendationsManagementSection formCommendations={formCommendations} />
  );
}
