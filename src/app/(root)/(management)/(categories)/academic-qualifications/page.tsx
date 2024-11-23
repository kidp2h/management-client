import React from 'react';

import AcademicQualificationsManagementSection from '@/components/features/academic-qualifications/academic-qualifications-management-section';
import { getAcademicQualifications } from '@/db/queries/academic-qualifications';
import { getAcademicQualificationsSchema } from '@/lib/zod/schemas/academic-qualification-schema';
import type { SearchParams } from '@/types';

export interface AcademicQualificationsManagementPageProps {
  searchParams: SearchParams;
}
export default async function AcademicQualificationsManagementPage({
  searchParams,
}: AcademicQualificationsManagementPageProps) {
  const search = getAcademicQualificationsSchema.parse(searchParams);

  const academicQualifications = getAcademicQualifications(search);

  return (
    <AcademicQualificationsManagementSection
      academicQualifications={academicQualifications}
    />
  );
}
