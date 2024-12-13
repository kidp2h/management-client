import React from 'react';

import RolesManagementSection from '@/components/features/roles/roles-management-section';
import {
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

  return (
    <RolesManagementSection
      roles={roles}
      configRole={configRole}
      configRoleApprove={configRoleApprove}
    />
  );
}
