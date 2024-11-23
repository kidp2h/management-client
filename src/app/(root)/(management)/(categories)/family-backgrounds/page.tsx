import React from 'react';

import FamilyBackgroundsManagementSection from '@/components/features/family-backgrounds/family-backgrounds-management-section';
import { getFamilyBackgrounds } from '@/db/queries/family-backgrounds';
import { getFamilyBackgroundsSchema } from '@/lib/zod/schemas/family-background-schema';
import type { SearchParams } from '@/types';

export interface FamilyBackgroundsManagementPageProps {
  searchParams: SearchParams;
}
export default async function FamilyBackgroundsManagementPage({
  searchParams,
}: FamilyBackgroundsManagementPageProps) {
  const search = getFamilyBackgroundsSchema.parse(searchParams);

  const familyBackgrounds = getFamilyBackgrounds(search);

  return (
    <FamilyBackgroundsManagementSection familyBackgrounds={familyBackgrounds} />
  );
}
