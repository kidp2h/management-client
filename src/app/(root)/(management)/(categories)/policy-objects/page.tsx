import React from 'react';

import PolicyObjectsManagementSection from '@/components/features/policy-objects/policy-objects-management-section';
import { getPolicyObjects } from '@/db/queries/policy-objects';
import { getPolicyObjectsSchema } from '@/lib/zod/schemas/policy-object-schema';
import type { SearchParams } from '@/types';

export interface PolicyObjectsManagementPageProps {
  searchParams: SearchParams;
}
export default async function PolicyObjectsManagementPage({
  searchParams,
}: PolicyObjectsManagementPageProps) {
  const search = getPolicyObjectsSchema.parse(searchParams);

  const policyObjects = getPolicyObjects(search);

  return <PolicyObjectsManagementSection policyObjects={policyObjects} />;
}
