'use client';

import React from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type {
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
import { ContentLayout } from '@/layouts';

import RecordContractSection from './contract/record-contract-section';
import UpdateInformationForm from './update-information-form';
import { Separator } from '@/components/ui/separator';
import RecordEducationSection from './record-education-section';
import RecordDisciplinesTable from './discipline/record-discipline-table';
import { getRecordDisciplinesById } from '@/db/queries/disciplines';
import { getRecordCommendationsById } from '@/db/queries/commendations';
import RecordCommendationsTable from './commendation/record-commendation-table';
import RecordWorkExperienceTable from './work-experience/record-work-experience-table';
import RecordRelationshipSection from './relationship/record-relationship-section';
import RecordSalarySection from './circumstance/record-salary-section';
import { getAllReligions } from '@/db/queries/religions';
import { getAllPublicEmployeeRanks } from '@/db/queries/public-employee-ranks';
import { getAllCivilServantRanks } from '@/db/queries/civil-servant-ranks';
import { getAllMilitaryRanks } from '@/db/queries/military-ranks';
import { getAllAppellations } from '@/db/queries/appellations';
import { getAllEthnicities } from '@/db/queries/ethnicities';
import { getAllSalaryGrades } from '@/db/queries/salary-grades';
import { getAllQualifications } from '@/db/queries/qualifications';
import { getAllFamilyBackgrounds } from '@/db/queries/family-backgrounds';
import { getAllPartyCommittees } from '@/db/queries/party-committees';
import { getAllDuties } from '@/db/queries/duties';
import { getAllFormDisciplines } from '@/db/queries/form-disciplines';
import {
  getAllDepartments,
  getDepartmentsByRecord,
} from '@/db/queries/departments';
import { getAllFormTrainings } from '@/db/queries/form-trainings';
import RecordHistorySection from './history/record-history-section';
import RecordAbroadSection from './abroad/record-abroad-section';
import { getRecordLanguagesById } from '@/db/queries/record-languages';
import RecordLanguagesTable from './language/record-language-table';
import { getAllLanguages } from '@/db/queries/languages';
import { getAllFormRecruitments } from '@/db/queries/form-recruitments';
import { ScrollArea } from '@/components/ui/scroll-area';
import RecordDualsTable from './dual/record-dual-table';
import { getRecordDualsById } from '@/db/queries/duals';
import RecordSecondmentsTable from './secondment/record-secondment-table';
import { getRecordSecondmentsById } from '@/db/queries/secondments';
import { getAllTypeContracts } from '@/db/queries/type-contracts';
import RecordPartiesTable from './party/record-party-table';
import { getRecordPartiesById } from '@/db/queries/parties';

export interface RecordDetailSectionProps {
  record: ReturnType<typeof getRecordById>;
  contracts: ReturnType<typeof getContractsRecordById>;
  trainings: ReturnType<typeof getTrainingsRecordById>;
  professions: ReturnType<typeof getProfessionsRecordById>;
  recordDisciplines: ReturnType<typeof getRecordDisciplinesById>;
  recordCommendations: ReturnType<typeof getRecordCommendationsById>;
  recordLanguages: ReturnType<typeof getRecordLanguagesById>;
  workExperiences: ReturnType<typeof getWorkExperiencesRecordById>;
  relationships: ReturnType<typeof getRelationshipRecordById>;
  salaries: ReturnType<typeof getSalariesRecordById>;
  allowances: ReturnType<typeof getAllowancesRecordById>;
  houses: ReturnType<typeof getHousesRecordById>;
  lands: ReturnType<typeof getLandsRecordById>;
  imprisioneds: ReturnType<typeof getImprisionedsRecordById>;
  oldRegimes: ReturnType<typeof getOldRegimesRecordById>;
  organizations: ReturnType<typeof getOrganizationsRecordById>;
  relatives: ReturnType<typeof getRelativesRecordById>;
  religions: ReturnType<typeof getAllReligions>;
  publicEmployeeRanks: ReturnType<typeof getAllPublicEmployeeRanks>;
  civilServantRanks: ReturnType<typeof getAllCivilServantRanks>;
  // policyObjects: ReturnType<typeof getAllPolicyObjects>;
  militaryRanks: ReturnType<typeof getAllMilitaryRanks>;
  // academicQualifications: ReturnType<typeof getAllAcademicQualifications>;
  qualifications: ReturnType<typeof getAllQualifications>;
  appellations: ReturnType<typeof getAllAppellations>;
  languages: ReturnType<typeof getAllLanguages>;
  ethnicities: ReturnType<typeof getAllEthnicities>;
  salaryGrades: ReturnType<typeof getAllSalaryGrades>;
  familyBackgrounds: ReturnType<typeof getAllFamilyBackgrounds>;
  partyCommittees: ReturnType<typeof getAllPartyCommittees>;
  duties: ReturnType<typeof getAllDuties>;
  formDisciplines: ReturnType<typeof getAllFormDisciplines>;
  departments: ReturnType<typeof getAllDepartments>;
  formTrainings: ReturnType<typeof getAllFormTrainings>;
  formRecruiments: ReturnType<typeof getAllFormRecruitments>;
  departmentsOfRecord: ReturnType<typeof getDepartmentsByRecord>;
  recordsDuals: ReturnType<typeof getRecordDualsById>;
  recordsSecondments: ReturnType<typeof getRecordSecondmentsById>;
  typeContracts: ReturnType<typeof getAllTypeContracts>;
  recordParties: ReturnType<typeof getRecordPartiesById>;
}
export default function RecordDetailSection({
  record,
  contracts,
  trainings,
  recordDisciplines,
  recordCommendations,
  workExperiences,
  relationships,
  salaries,
  allowances,
  houses,
  lands,
  religions,
  publicEmployeeRanks,
  civilServantRanks,
  // policyObjects,
  militaryRanks,
  // academicQualifications,
  qualifications,
  appellations,
  ethnicities,
  salaryGrades,
  familyBackgrounds,
  partyCommittees,
  duties,
  formDisciplines,
  departments,
  formTrainings,
  imprisioneds,
  oldRegimes,
  organizations,
  relatives,
  recordLanguages,
  languages,
  formRecruiments,
  recordsDuals,
  departmentsOfRecord,
  recordsSecondments,
  typeContracts,
  recordParties,
}: RecordDetailSectionProps) {
  const { data } = React.use(record);
  const [tab, setTab] = React.useState('info');

  const onTabChange = value => {
    setTab(value);
  };
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý hồ sơ', href: '/records' },
    { isSeparator: true },
    { name: data?.fullName || '' },
  ];
  return (
    <ContentLayout title="Chi tiết hồ sơ">
      <AutoBreadcrumb items={items} />
      <MainContent>
        <span className="font-bold text-xl mb-3 block">
          Danh sách các mục thông tin
        </span>
        <Tabs
          defaultValue="info"
          value={tab}
          onValueChange={onTabChange}
          orientation="vertical"
          data-order="vertical"
        >
          <TabsList className="flex flex-row h-full justify-start items-start w-fit mb-5 bg-transparent">
            <ScrollArea>
              <TabsTrigger value="info">Thông tin chung</TabsTrigger>
              <TabsTrigger value="languages">Ngoại ngữ</TabsTrigger>
              {/*
            <TabsTrigger value="technologyCertification">
              Chứng chỉ tin học
            </TabsTrigger> */}
              <TabsTrigger value="contract">
                Quá trình biên chế, hợp đồng
              </TabsTrigger>
              <TabsTrigger value="commendation">
                22. Quá trình khen thưởng
              </TabsTrigger>
              <TabsTrigger value="discipline">
                23. Quá trình kỷ luật
              </TabsTrigger>
              <TabsTrigger value="education">
                26.Quá trình đào tạo và bồi dưỡng
              </TabsTrigger>
              <TabsTrigger value="workExperience">
                27. Quá trình công tác
              </TabsTrigger>
              <TabsTrigger value="historyPersonal">
                28. Đặc điểm lịch sử bản thân
              </TabsTrigger>
              <TabsTrigger value="relationWithForeign">
                29. Quan hệ với nước ngoài
              </TabsTrigger>

              <TabsTrigger value="relationship">
                30. Quan hệ gia đình
              </TabsTrigger>
              <TabsTrigger value="salary">
                31. Hoàn cảnh kinh tế gia đình
              </TabsTrigger>
              <TabsTrigger value="dual">Quá trình kiêm nhiệm</TabsTrigger>
              <TabsTrigger value="secondment">Quá trình biệt phái</TabsTrigger>
              <TabsTrigger value="parties">Quá trình công tác Đảng</TabsTrigger>
            </ScrollArea>
          </TabsList>
          <TabsContent value="info">
            {/* <div className="grid grid-cols-2 px-3">
              <div className="mb-7 flex flex-row gap-3">
                <div className="flex flex-row items-center gap-2 font-bold">
                  <TypeOutline className="size-5 text-pink-500" />
                  Họ và tên
                </div>
                <Badge variant="default">{data?.fullName}</Badge>
              </div>
              <div className="mb-7 flex flex-row gap-3">
                <div className="flex flex-row items-center gap-2 font-bold">
                  <Dna className="size-5" />
                  Giới tính
                </div>
                <Badge variant="default">{data?.gender}</Badge>
              </div>
              <div className="mb-7 flex flex-row gap-3">
                <div className="flex flex-row items-center gap-2 font-bold">
                  <University className="size-5 text-indigo-500" />
                  Tôn giáo
                </div>
                <Badge variant={`${data?.religion ? 'default' : 'outline'}`}>
                  {data?.religion || 'Chưa cập nhật'}
                </Badge>
              </div>
              <div className="mb-7 flex flex-row gap-3">
                <div className="flex flex-row items-center gap-2 font-bold">
                  <BookOpen className="size-5 text-green-500" />
                  Trình độ
                </div>
                <Badge variant={`${data?.rank?.name ? 'default' : 'outline'}`}>
                  {data?.rank?.name || 'Chưa cập nhật'}
                </Badge>
              </div>
              <div className="mb-7 flex flex-row gap-3">
                <div className="flex flex-row items-center gap-2 font-bold">
                  <BookCheck className="size-5 text-cyan-500" />
                  Tiếng Anh
                </div>
                <Badge
                  variant={`${data?.englishCertification ? 'default' : 'outline'}`}
                >
                  {data?.englishCertification || 'Chưa cập nhật'}
                </Badge>
              </div>
              <div className="mb-7 flex flex-row gap-3">
                <div className="flex flex-row items-center gap-2 font-bold">
                  <Cpu className="size-5 text-blue-500" />
                  Tin học
                </div>
                <Badge
                  variant={`${data?.technologyCertification ? 'default' : 'outline'}`}
                >
                  {data?.technologyCertification || 'Chưa cập nhật'}
                </Badge>
              </div>
              <div className="mb-7 flex flex-row gap-3">
                <div className="flex flex-row items-center gap-2 font-bold">
                  <HeartPulse className="size-5 text-red-500" />
                  Nhóm máu
                </div>
                <Badge variant={`${data?.bloodType ? 'default' : 'outline'}`}>
                  {data?.bloodType || 'Chưa cập nhật'}
                </Badge>
              </div>
              <div className="mb-7 flex flex-row gap-3">
                <div className="flex flex-row items-center gap-2 font-bold">
                  <Building className="size-5 text-yellow-500" />
                  Đảng viên
                </div>
                <Badge variant="default">
                  {data?.isPartyMember
                    ? 'Là đảng viên'
                    : 'Không phải đảng viên'}
                </Badge>
              </div>
              <div className="mb-7 flex flex-row gap-3">
                <div className="flex flex-row items-center gap-2 font-bold">
                  <BriefcaseBusiness className="size-5 text-red-500" />
                  Ngạch
                </div>
                <Badge
                  variant={`${data?.classificationCode ? 'default' : 'outline'}`}
                >
                  {data?.classificationCode || 'Chưa cập nhật'}
                </Badge>
              </div>
            </div> */}
            <Separator className="my-5" />

            <UpdateInformationForm
              defaultValues={data}
              setTab={setTab}
              data={{
                religions,
                publicEmployeeRanks,
                ethnicities,
                civilServantRanks,
                // policyObjects,
                militaryRanks,
                // academicQualifications,
                qualifications,
                appellations,
                salaryGrades,
                familyBackgrounds,
                partyCommittees,
                duties,
              }}
            />
          </TabsContent>
          <TabsContent value="contract" className="w-full">
            <RecordContractSection
              typeContracts={typeContracts}
              contracts={contracts}
              id={data?.id || ''}
              formRecruitments={formRecruiments}
            />
          </TabsContent>
          <TabsContent value="commendation" className="w-full">
            <div>
              <span className="block text-xl font-bold mb-5">
                22. Quá trình khen thưởng
              </span>
              <Separator />
              <div className="my-5">
                <RecordCommendationsTable
                  recordCommendations={recordCommendations}
                  record={data}
                  appellations={appellations}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="discipline">
            <span className="block text-xl font-bold mb-5">
              23. Quá trình kỷ luật
            </span>
            <Separator />
            <div className="my-5">
              <RecordDisciplinesTable
                recordDisciplines={recordDisciplines}
                departments={departments}
                formDisciplines={formDisciplines}
                record={data}
              />
            </div>
          </TabsContent>
          <TabsContent value="education" className="w-full">
            <RecordEducationSection
              record={data}
              qualifications={qualifications}
              formTrainings={formTrainings}
              trainings={trainings}
            />
          </TabsContent>
          <TabsContent value="workExperience" className="w-full">
            <RecordWorkExperienceTable
              workExperiences={workExperiences}
              duties={duties}
              departments={departments}
              id={data?.id || ''}
            />
          </TabsContent>
          <TabsContent value="relationship" className="w-full">
            <RecordRelationshipSection
              relationships={relationships}
              id={data?.id || ''}
            />
          </TabsContent>
          <TabsContent value="salary" className="w-full">
            <RecordSalarySection
              civilServantRanks={civilServantRanks}
              salaryGrades={salaryGrades}
              publicEmployeeRanks={publicEmployeeRanks}
              houses={houses}
              salaries={salaries}
              allowances={allowances}
              lands={lands}
              id={data?.id || ''}
            />
          </TabsContent>
          <TabsContent value="historyPersonal">
            <RecordHistorySection
              id={data?.id || ''}
              oldRegimes={oldRegimes}
              imprisioneds={imprisioneds}
            />
          </TabsContent>
          <TabsContent value="relationWithForeign">
            <RecordAbroadSection
              id={data?.id || ''}
              organizations={organizations}
              relatives={relatives}
            />
          </TabsContent>
          <TabsContent value="languages">
            <RecordLanguagesTable
              recordLanguages={recordLanguages}
              languages={languages}
              record={data}
            />
          </TabsContent>
          <TabsContent value="dual">
            <RecordDualsTable
              duties={duties}
              recordDuals={recordsDuals}
              record={data}
              departmentsOfRecord={departmentsOfRecord}
            />
          </TabsContent>
          <TabsContent value="secondment">
            <RecordSecondmentsTable
              departments={departments}
              recordSecondments={recordsSecondments}
              record={data}
              duties={duties}
            />
          </TabsContent>
          <TabsContent value="parties">
            <RecordPartiesTable recordParties={recordParties} record={data} />
          </TabsContent>
        </Tabs>
      </MainContent>
    </ContentLayout>
  );
}
