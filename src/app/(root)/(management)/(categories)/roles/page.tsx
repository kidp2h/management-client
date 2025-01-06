import React from 'react';

import RolesManagementSection from '@/components/features/roles/roles-management-section';
import {
  getAllRoles,
  getDetailConfigRole,
  getDetailConfigRoleApprove,
  getRoles,
} from '@/db/queries/roles';
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
  const configRole = getDetailConfigRole();
  const configRoleApprove = getDetailConfigRoleApprove();
  const allRoles = getAllRoles();

  return (
    <RolesManagementSection
      roles={roles}
      allRoles={allRoles}
      configRole={configRole}
      configRoleApprove={configRoleApprove}
    />
  );
}
