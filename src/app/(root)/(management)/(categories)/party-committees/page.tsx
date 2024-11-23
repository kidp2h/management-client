import React from 'react';

import PartyCommitteesManagementSection from '@/components/features/party-committees/party-committees-management-section';
import { getPartyCommittees } from '@/db/queries/party-committees';
import { getPartyCommitteesSchema } from '@/lib/zod/schemas/party-committee-schema';
import type { SearchParams } from '@/types';

export interface PartyCommitteesManagementPageProps {
  searchParams: SearchParams;
}
export default async function PartyCommitteesManagementPage({
  searchParams,
}: PartyCommitteesManagementPageProps) {
  const search = getPartyCommitteesSchema.parse(searchParams);

  const partyCommittees = getPartyCommittees(search);

  return <PartyCommitteesManagementSection partyCommittees={partyCommittees} />;
}
