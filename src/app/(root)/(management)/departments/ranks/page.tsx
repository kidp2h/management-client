import React from 'react';

import RanksManagementSection from '@/components/features/ranks/ranks-management-section';
import { getRanks } from '@/db/queries/ranks';
import { getRanksSchema } from '@/lib/zod/schemas/rank-schema';
import type { SearchParams } from '@/types';

export interface RanksManagementPageProps {
  searchParams: SearchParams;
}
export default async function RanksManagementPage({
  searchParams,
}: RanksManagementPageProps) {
  const search = getRanksSchema.parse(searchParams);

  const ranks = getRanks(search);

  return <RanksManagementSection ranks={ranks} />;
}
