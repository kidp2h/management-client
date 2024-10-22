import React from 'react';

import PermissionsManagementSection from '@/components/features/permissions/permissions-management-section';
import { getPermissions } from '@/db/queries/permissions';
import { getPermissionsSchema } from '@/lib/zod/schemas/permission-schema';
import type { SearchParams } from '@/types';

export interface PermissionsManagementPageProps {
  searchParams: SearchParams;
}
export default async function PermissionsManagementPage({
  searchParams,
}: PermissionsManagementPageProps) {
  const search = getPermissionsSchema.parse(searchParams);

  const permissions = getPermissions(search);

  return <PermissionsManagementSection permissions={permissions} />;
}
