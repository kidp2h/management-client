import React from 'react';

import RolesManagementSection from '@/components/features/roles/roles-management-section';
import { getRoles } from '@/db/queries/roles';
import { getRolesSchema } from '@/lib/zod/schemas/role-schema';
import type { SearchParams } from '@/types';

export interface RolesManagementPageProps {
  searchParams: SearchParams;
}
export default async function RolesManagementPage({
  searchParams,
}: RolesManagementPageProps) {
  const search = getRolesSchema.parse(searchParams);

  const roles = getRoles(search);

  return <RolesManagementSection roles={roles} />;
}
