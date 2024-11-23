import RecordDetailSection from '@/components/features/record/record-detail-section';
import { getAllAcademicQualifications } from '@/db/queries/academic-qualifications';
import { getAllAppellations } from '@/db/queries/appellations';
import { getAllCivilServantRanks } from '@/db/queries/civil-servant-ranks';
import { getRecordCommendationsById } from '@/db/queries/commendations';
import { getAllDepartments } from '@/db/queries/departments';
import { getRecordDisciplinesById } from '@/db/queries/disciplines';
import { getAllDuties } from '@/db/queries/duties';
import { getAllEthnicities } from '@/db/queries/ethnicities';
import { getAllFamilyBackgrounds } from '@/db/queries/family-backgrounds';
import { getAllFormDisciplines } from '@/db/queries/form-disciplines';
import { getAllFormTrainings } from '@/db/queries/form-trainings';
import { getAllMilitaryRanks } from '@/db/queries/military-ranks';
import { getAllPartyCommittees } from '@/db/queries/party-committees';
import { getAllPolicyObjects } from '@/db/queries/policy-objects';
import { getAllPublicEmployeeRanks } from '@/db/queries/public-employee-ranks';
import { getAllQualifications } from '@/db/queries/qualifications';
import {
  getAllowancesRecordById,
  getContractsRecordById,
  getHousesRecordById,
  getImprisionedsRecordById,
  getLandsRecordById,
  getOldRegimesRecordById,
  getOrganizationsRecordById,
  getProfessionsRecordById,
  getRecordById,
  getRelationshipRecordById,
  getRelativesRecordById,
  getSalariesRecordById,
  getTrainingsRecordById,
  getWorkExperiencesRecordById,
} from '@/db/queries/records';
import { getAllReligions } from '@/db/queries/religions';
import { getAllSalaryGrades } from '@/db/queries/salary-grades';
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
    const imprisioneds = getImprisionedsRecordById(recordId);
    const oldRegimes = getOldRegimesRecordById(recordId);
    const organizations = getOrganizationsRecordById(recordId);
    const relatives = getRelativesRecordById(recordId);
    const religions = getAllReligions();
    const ethnicities = getAllEthnicities();
    const publicEmployeeRanks = getAllPublicEmployeeRanks();
    const civilServantRanks = getAllCivilServantRanks();
    const policyObjects = getAllPolicyObjects();
    const militaryRanks = getAllMilitaryRanks();
    const academicQualifications = getAllAcademicQualifications();
    const qualifications = getAllQualifications();
    const appellations = getAllAppellations();
    const salaryGrades = getAllSalaryGrades();
    const familyBackgrounds = getAllFamilyBackgrounds();
    const duties = getAllDuties();
    const partyCommittees = getAllPartyCommittees();
    const departments = getAllDepartments();
    const formDisciplines = getAllFormDisciplines();
    const formTrainings = getAllFormTrainings();

    return (
      <RecordDetailSection
        record={getRecordById(recordId)}
        religions={religions}
        lands={lands}
        imprisioneds={imprisioneds}
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
        ethnicities={ethnicities}
        publicEmployeeRanks={publicEmployeeRanks}
        civilServantRanks={civilServantRanks}
        policyObjects={policyObjects}
        militaryRanks={militaryRanks}
        academicQualifications={academicQualifications}
        qualifications={qualifications}
        appellations={appellations}
        salaryGrades={salaryGrades}
        familyBackgrounds={familyBackgrounds}
        partyCommittees={partyCommittees}
        duties={duties}
        departments={departments}
        formDisciplines={formDisciplines}
        formTrainings={formTrainings}
        oldRegimes={oldRegimes}
        relatives={relatives}
        organizations={organizations}
      />
    );
  }
  // if (!recordId) return redirect('/records');
}
