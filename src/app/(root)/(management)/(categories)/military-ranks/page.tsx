import React from 'react';

import MilitaryRanksManagementSection from '@/components/features/military-ranks/military-ranks-management-section';
import { getMilitaryRanks } from '@/db/queries/military-ranks';
import { getMilitaryRanksSchema } from '@/lib/zod/schemas/military-rank-schema';
import type { SearchParams } from '@/types';

export interface MilitaryRanksManagementPageProps {
  searchParams: SearchParams;
}
export default async function MilitaryRanksManagementPage({
  searchParams,
}: MilitaryRanksManagementPageProps) {
  const search = getMilitaryRanksSchema.parse(searchParams);

  const militaryRanks = getMilitaryRanks(search);

  return <MilitaryRanksManagementSection militaryRanks={militaryRanks} />;
}
