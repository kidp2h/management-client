import React from 'react';

import TypeContractsManagementSection from '@/components/features/type-contracts/type-contracts-management-section';
import { getTypeContracts } from '@/db/queries/type-contracts';
import { getTypeContractsSchema } from '@/lib/zod/schemas/type-contract-schema';
import type { SearchParams } from '@/types';

export interface TypeContractsManagementPageProps {
  searchParams: SearchParams;
}
export default async function TypeContractsManagementPage({
  searchParams,
}: TypeContractsManagementPageProps) {
  const search = getTypeContractsSchema.parse(searchParams);

  const typeContracts = getTypeContracts(search);

  return <TypeContractsManagementSection typeContracts={typeContracts} />;
}
