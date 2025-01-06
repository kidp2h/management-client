'use memo';
import { clerkClient } from '@clerk/nextjs/server';
import React from 'react';

import { UsersManagementSection } from '@/components/features/users/users-management-section';
import type { SearchParams } from '@/types';
import { getAllRoles } from '@/db/queries/roles';
import { getAllDepartments } from '@/db/queries/departments';

type RecordsManagementPageProps = {
  searchParams: SearchParams;
};
export default async function UsersManagementPage({
  searchParams,
}: RecordsManagementPageProps) {
  // console.log(searchParams);
  const username =
    typeof searchParams.username === 'string'
      ? searchParams.username?.split('~')[0]
      : undefined;
  try {
    const query: Record<string, any> = {
      limit: 10,
      offset: searchParams.page ? ((searchParams.page as any) - 1) * 10 : 0,
      orderBy: '-created_at',
    };
    if (username && username.length >= 3) {
      query.username = `${username}`;
    }
    const [roles, departments] = await Promise.all([
      getAllRoles(),
      getAllDepartments(),
    ]);
    const users = await clerkClient().users.getUserList(query);
    return (
      <UsersManagementSection
        users={JSON.parse(JSON.stringify(users.data))}
        pageCount={Math.ceil(users.totalCount / 10)}
        departments={departments?.data || []}
        roles={roles.data || []}
      />
    );
  } catch (error) {
    console.error(error);
  }
}
