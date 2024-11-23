import React from 'react';

import ReligionsManagementSection from '@/components/features/religions/religions-management-section';
import { getReligions } from '@/db/queries/religions';
import { getReligionsSchema } from '@/lib/zod/schemas/religion-schema';
import type { SearchParams } from '@/types';

export interface ReligionsManagementPageProps {
  searchParams: SearchParams;
}
export default async function ReligionsManagementPage({
  searchParams,
}: ReligionsManagementPageProps) {
  const search = getReligionsSchema.parse(searchParams);

  const religions = getReligions(search);

  return <ReligionsManagementSection religions={religions} />;
}
