import React from 'react';

import FormRetiresManagementSection from '@/components/features/form-retires/form-retires-management-section';
import { getFormRetires } from '@/db/queries/form-retires';
import { getFormRetiresSchema } from '@/lib/zod/schemas/form-retire-schema';
import type { SearchParams } from '@/types';

export interface FormRetiresManagementPageProps {
  searchParams: SearchParams;
}
export default async function FormRetiresManagementPage({
  searchParams,
}: FormRetiresManagementPageProps) {
  const search = getFormRetiresSchema.parse(searchParams);

  const formRetires = getFormRetires(search);

  return <FormRetiresManagementSection formRetires={formRetires} />;
}
