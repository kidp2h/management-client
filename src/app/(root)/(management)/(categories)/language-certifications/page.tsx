import React from 'react';

import LanguageCertificationsManagementSection from '@/components/features/language-certifications/language-certifications-management-section';
import { getLanguageCertifications } from '@/db/queries/language-certifications';
import { getLanguageCertificationsSchema } from '@/lib/zod/schemas/language-certification-schema';
import type { SearchParams } from '@/types';

export interface LanguageCertificationsManagementPageProps {
  searchParams: SearchParams;
}
export default async function LanguageCertificationsManagementPage({
  searchParams,
}: LanguageCertificationsManagementPageProps) {
  const search = getLanguageCertificationsSchema.parse(searchParams);

  const languageCertifications = getLanguageCertifications(search);

  return (
    <LanguageCertificationsManagementSection
      languageCertifications={languageCertifications}
    />
  );
}
