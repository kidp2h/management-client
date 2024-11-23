import React from 'react';

import EthnicitiesManagementSection from '@/components/features/ethnicities/ethnicities-management-section';
import { getEthnicities } from '@/db/queries/ethnicities';
import { getEthnicitiesSchema } from '@/lib/zod/schemas/ethnicity-schema';
import type { SearchParams } from '@/types';

export interface EthnicitiesManagementPageProps {
  searchParams: SearchParams;
}
export default async function EthnicitiesManagementPage({
  searchParams,
}: EthnicitiesManagementPageProps) {
  const search = getEthnicitiesSchema.parse(searchParams);

  const ethnicities = getEthnicities(search);

  return <EthnicitiesManagementSection ethnicities={ethnicities} />;
}
