import RecordDetailSection from '@/components/features/record/record-detail-section';
import { getRecordCommendationsById } from '@/db/queries/commendation';
import { getRecordDisciplinesById } from '@/db/queries/disciplines';
import {
  getAllowancesRecordById,
  getContractsRecordById,
  getHousesRecordById,
  getLandsRecordById,
  getProfessionsRecordById,
  getRecordById,
  getRelationshipRecordById,
  getSalariesRecordById,
  getTrainingsRecordById,
  getWorkExperiencesRecordById,
} from '@/db/queries/records';
import { decode } from 'js-base64';
import React from 'react';

type RecordDetailPageProps = {
  params: { id: string };
};
export default async function RecordDetailPage({
  params,
}: RecordDetailPageProps) {
  if (params.id !== undefined && params.id !== 'undefined') {
    const recordId = decode(params.id);

    const contracts = getContractsRecordById(recordId);
    const trainings = getTrainingsRecordById(recordId);
    const professions = getProfessionsRecordById(recordId);
    const recordDisciplines = getRecordDisciplinesById(recordId);
    const recordCommendations = getRecordCommendationsById(recordId);
    const workExperiences = getWorkExperiencesRecordById(recordId);
    const relationships = getRelationshipRecordById(recordId);
    const salaries = getSalariesRecordById(recordId);
    const allowances = getAllowancesRecordById(recordId);
    const houses = getHousesRecordById(recordId);
    const lands = getLandsRecordById(recordId);

    return (
      <RecordDetailSection
        record={getRecordById(recordId)}
        lands={lands}
        houses={houses}
        professions={professions}
        contracts={contracts}
        trainings={trainings}
        recordDisciplines={recordDisciplines}
        recordCommendations={recordCommendations}
        workExperiences={workExperiences}
        relationships={relationships}
        salaries={salaries}
        allowances={allowances}
      />
    );
  }
  // if (!recordId) return redirect('/records');
}
