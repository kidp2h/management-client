import React from 'react';

import DutiesManagementSection from '@/components/features/duties/duties-management-section';
import { getDuties } from '@/db/queries/duties';
import { getDutiesSchema } from '@/lib/zod/schemas/duty-schema';
import type { SearchParams } from '@/types';

export interface DutiesManagementPageProps {
  searchParams: SearchParams;
}
export default async function DutiesManagementPage({
  searchParams,
}: DutiesManagementPageProps) {
  const search = getDutiesSchema.parse(searchParams);

  const duties = getDuties(search);

  return <DutiesManagementSection duties={duties} />;
}
