'use memo';
import { clerkClient } from '@clerk/nextjs/server';
import React from 'react';

import { UsersManagementSection } from '@/components/features/users/users-management-section';
import type { SearchParams } from '@/types';

type RecordsManagementPageProps = {
  searchParams: SearchParams;
};
export default async function UsersManagementPage({
  searchParams,
}: RecordsManagementPageProps) {
  console.log(searchParams);
  const username =
    typeof searchParams.username === 'string'
      ? searchParams.username?.split('~')[0]
      : undefined;
  try {
    const query: Record<string, any> = {
      limit: 10,
      orderBy: '-created_at',
    };
    if (username && username.length >= 3) {
      query.username = `${username}`;
    }
    const users = await clerkClient().users.getUserList(query);
    return (
      <UsersManagementSection
        users={JSON.parse(JSON.stringify(users.data))}
        pageCount={Math.ceil(users.totalCount / 10)}
      />
    );
  } catch (error) {
    console.log(error);
  }
}
