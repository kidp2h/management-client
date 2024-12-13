import React from 'react';

import FormSalaryManagementSection from '@/components/features/form-salary/form-salary-management-section';
import { getFormSalary } from '@/db/queries/form-salary';
import { getFormSalarySchema } from '@/lib/zod/schemas/form-salary-schema';
import type { SearchParams } from '@/types';

export interface FormSalaryManagementPageProps {
  searchParams: SearchParams;
}
export default async function FormSalaryManagementPage({
  searchParams,
}: FormSalaryManagementPageProps) {
  const search = getFormSalarySchema.parse(searchParams);

  const formSalary = getFormSalary(search);

  return <FormSalaryManagementSection formSalary={formSalary} />;
}
