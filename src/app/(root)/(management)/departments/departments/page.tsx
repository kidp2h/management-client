import React from 'react';

import DepartmentsManagementSection from '@/components/features/departments/departments-management-section';
import { getDepartments } from '@/db/queries/departments';
import { getDepartmentsSchema } from '@/lib/zod/schemas/department-schema';
import type { SearchParams } from '@/types';

export interface DepartmentsManagementPageProps {
  searchParams: SearchParams;
}
export default async function DepartmentsManagementPage({
  searchParams,
}: DepartmentsManagementPageProps) {
  const search = getDepartmentsSchema.parse(searchParams);

  const departments = getDepartments(search);

  return <DepartmentsManagementSection departments={departments} />;
}
