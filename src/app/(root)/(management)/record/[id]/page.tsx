import RecordDetailSection from '@/components/features/record/record-detail-section';
import { getAllAppellations } from '@/db/queries/appellations';
import { getAllCivilServantRanks } from '@/db/queries/civil-servant-ranks';
import { getRecordCommendationsById } from '@/db/queries/commendations';
import {
  getAllDepartments,
  getDepartmentsByRecord,
} from '@/db/queries/departments';
import { getRecordDisciplinesById } from '@/db/queries/disciplines';
import { getRecordDualsById } from '@/db/queries/duals';
import { getAllDuties } from '@/db/queries/duties';
import { getAllEthnicities } from '@/db/queries/ethnicities';
import { getAllFamilyBackgrounds } from '@/db/queries/family-backgrounds';
import { getAllFormDisciplines } from '@/db/queries/form-disciplines';
import { getAllFormRecruitments } from '@/db/queries/form-recruitments';
import { getAllFormTrainings } from '@/db/queries/form-trainings';
import { getAllLanguages } from '@/db/queries/languages';
import { getAllMilitaryRanks } from '@/db/queries/military-ranks';
import { getRecordPartiesById } from '@/db/queries/parties';
import { getAllPartyCommittees } from '@/db/queries/party-committees';
import { getAllPublicEmployeeRanks } from '@/db/queries/public-employee-ranks';
import { getAllQualifications } from '@/db/queries/qualifications';
import { getRecordLanguagesById } from '@/db/queries/record-languages';
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
import { getRecordSecondmentsById } from '@/db/queries/secondments';
import { getAllTypeContracts } from '@/db/queries/type-contracts';
import { currentUser } from '@clerk/nextjs/server';
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
    const user = await currentUser();

    const contracts = getContractsRecordById(recordId);
    const trainings = getTrainingsRecordById(recordId);
    const professions = getProfessionsRecordById(recordId);
    const recordDisciplines = getRecordDisciplinesById(recordId);
    const recordCommendations = getRecordCommendationsById(recordId);
    const recordLanguages = getRecordLanguagesById(recordId);
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
    // const policyObjects = getAllPolicyObjects();
    const militaryRanks = getAllMilitaryRanks();
    // const academicQualifications = getAllAcademicQualifications();
    const qualifications = getAllQualifications();
    const appellations = getAllAppellations();
    const salaryGrades = getAllSalaryGrades();
    const familyBackgrounds = getAllFamilyBackgrounds();
    const duties = getAllDuties();
    const partyCommittees = getAllPartyCommittees();
    const departments = getAllDepartments();
    const formDisciplines = getAllFormDisciplines();
    const formTrainings = getAllFormTrainings();
    const formRecruiments = getAllFormRecruitments();
    const languages = getAllLanguages();
    const recordsDuals = getRecordDualsById(recordId);
    const recordsSecondments = getRecordSecondmentsById(recordId);
    const departmentsOfRecord = getDepartmentsByRecord(recordId);
    const typeContracts = getAllTypeContracts();
    const recordParties = getRecordPartiesById(recordId);
    console.log(await formRecruiments);
    // if (user?.publicMetadata?.roleName !== 'Quản lý') {
    //   if ((user?.publicMetadata?.record as any)?.id !== recordId) {
    //     return redirect('/');
    //   }
    // }
    return (
      <RecordDetailSection
        typeContracts={typeContracts}
        formRecruiments={formRecruiments}
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
        recordLanguages={recordLanguages}
        workExperiences={workExperiences}
        relationships={relationships}
        salaries={salaries}
        allowances={allowances}
        ethnicities={ethnicities}
        publicEmployeeRanks={publicEmployeeRanks}
        civilServantRanks={civilServantRanks}
        // policyObjects={policyObjects}
        militaryRanks={militaryRanks}
        // academicQualifications={academicQualifications}
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
        languages={languages}
        recordsDuals={recordsDuals}
        departmentsOfRecord={departmentsOfRecord}
        recordsSecondments={recordsSecondments}
        recordParties={recordParties}
      />
    );
  }
  // if (!recordId) return redirect('/records');
}
