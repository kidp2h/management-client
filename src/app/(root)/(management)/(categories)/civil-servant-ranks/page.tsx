import React from 'react';

import CivilServantRanksManagementSection from '@/components/features/civil-servant-ranks/civil-servant-ranks-management-section';
import { getCivilServantRanks } from '@/db/queries/civil-servant-ranks';
import { getCivilServantRanksSchema } from '@/lib/zod/schemas/civil-servant-rank-schema';
import type { SearchParams } from '@/types';

export interface CivilServantRanksManagementPageProps {
  searchParams: SearchParams;
}
export default async function CivilServantRanksManagementPage({
  searchParams,
}: CivilServantRanksManagementPageProps) {
  const search = getCivilServantRanksSchema.parse(searchParams);

  const civilServantRanks = getCivilServantRanks(search);

  return (
    <CivilServantRanksManagementSection civilServantRanks={civilServantRanks} />
  );
}
