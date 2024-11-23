import React from 'react';

import PublicEmployeeRanksManagementSection from '@/components/features/public-employee-ranks/public-employee-ranks-management-section';
import { getPublicEmployeeRanks } from '@/db/queries/public-employee-ranks';
import { getPublicEmployeeRanksSchema } from '@/lib/zod/schemas/public-employee-rank-schema';
import type { SearchParams } from '@/types';

export interface PublicEmployeeRanksManagementPageProps {
  searchParams: SearchParams;
}
export default async function PublicEmployeeRanksManagementPage({
  searchParams,
}: PublicEmployeeRanksManagementPageProps) {
  const search = getPublicEmployeeRanksSchema.parse(searchParams);

  const publicEmployeeRanks = getPublicEmployeeRanks(search);

  return (
    <PublicEmployeeRanksManagementSection
      publicEmployeeRanks={publicEmployeeRanks}
    />
  );
}
