import React from 'react';

import PositionsManagementSection from '@/components/features/positions/positions-management-section';
import { getPositions } from '@/db/queries/positions';
import { getPositionsSchema } from '@/lib/zod/schemas/position-schema';
import type { SearchParams } from '@/types';

export interface PositionsManagementPageProps {
  searchParams: SearchParams;
}
export default async function PositionsManagementPage({
  searchParams,
}: PositionsManagementPageProps) {
  const search = getPositionsSchema.parse(searchParams);

  const positions = getPositions(search);

  return <PositionsManagementSection positions={positions} />;
}
