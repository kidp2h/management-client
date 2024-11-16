import React from 'react';

import LanguagesManagementSection from '@/components/features/languages/languages-management-section';
import { getLanguages } from '@/db/queries/languages';
import { getLanguagesSchema } from '@/lib/zod/schemas/language-schema';
import type { SearchParams } from '@/types';

export interface LanguagesManagementPageProps {
  searchParams: SearchParams;
}
export default async function LanguagesManagementPage({
  searchParams,
}: LanguagesManagementPageProps) {
  const search = getLanguagesSchema.parse(searchParams);

  const languages = getLanguages(search);

  return <LanguagesManagementSection languages={languages} />;
}
