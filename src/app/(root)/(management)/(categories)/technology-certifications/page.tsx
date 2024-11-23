import React from 'react';

import TechnologyCertificationsManagementSection from '@/components/features/technology-certifications/technology-certifications-management-section';
import { getTechnologyCertifications } from '@/db/queries/technology-certifications';
import { getTechnologyCertificationsSchema } from '@/lib/zod/schemas/technology-certification-schema';
import type { SearchParams } from '@/types';

export interface TechnologyCertificationsManagementPageProps {
  searchParams: SearchParams;
}
export default async function TechnologyCertificationsManagementPage({
  searchParams,
}: TechnologyCertificationsManagementPageProps) {
  const search = getTechnologyCertificationsSchema.parse(searchParams);

  const technologyCertifications = getTechnologyCertifications(search);

  return (
    <TechnologyCertificationsManagementSection
      technologyCertifications={technologyCertifications}
    />
  );
}
