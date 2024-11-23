import React from 'react';

import AppellationsManagementSection from '@/components/features/appellations/appellations-management-section';
import { getAppellations } from '@/db/queries/appellations';
import { getAppellationsSchema } from '@/lib/zod/schemas/appellation-schema';
import type { SearchParams } from '@/types';

export interface AppellationsManagementPageProps {
  searchParams: SearchParams;
}
export default async function AppellationsManagementPage({
  searchParams,
}: AppellationsManagementPageProps) {
  const search = getAppellationsSchema.parse(searchParams);

  const appellations = getAppellations(search);

  return <AppellationsManagementSection appellations={appellations} />;
}
