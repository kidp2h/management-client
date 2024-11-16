'use client';
import {
  BookCheck,
  BookOpen,
  BriefcaseBusiness,
  Building,
  Cpu,
  Dna,
  HeartPulse,
  TypeOutline,
  University,
} from 'lucide-react';
import React from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type {
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
import { ContentLayout } from '@/layouts';

import RecordContractSection from './contract/record-contract-section';
import UpdateInformationForm from './update-information-form';
import { Separator } from '@/components/ui/separator';
import RecordEducationSection from './record-education-section';
import RecordDisciplinesTable from './discipline/record-discipline-table';
import { getRecordDisciplinesById } from '@/db/queries/disciplines';
import { getRecordCommendationsById } from '@/db/queries/commendation';
import RecordCommendationsTable from './commendation/record-commendation-table';
import RecordWorkExperienceTable from './work-experience/record-work-experience-table';
import RecordRelationshipSection from './relationship/record-relationship-section';
import RecordSalarySection from './circumstance/record-salary-section';

export interface RecordDetailSectionProps {
  record: ReturnType<typeof getRecordById>;
  contracts: ReturnType<typeof getContractsRecordById>;
  trainings: ReturnType<typeof getTrainingsRecordById>;
  professions: ReturnType<typeof getProfessionsRecordById>;
  recordDisciplines: ReturnType<typeof getRecordDisciplinesById>;
  recordCommendations: ReturnType<typeof getRecordCommendationsById>;
  workExperiences: ReturnType<typeof getWorkExperiencesRecordById>;
  relationships: ReturnType<typeof getRelationshipRecordById>;
  salaries: ReturnType<typeof getSalariesRecordById>;
  allowances: ReturnType<typeof getAllowancesRecordById>;
  houses: ReturnType<typeof getHousesRecordById>;
  lands: ReturnType<typeof getLandsRecordById>;
}
export default function RecordDetailSection({
  record,
  contracts,
  trainings,
  professions,
  recordDisciplines,
  recordCommendations,
  workExperiences,
  relationships,
  salaries,
  allowances,
  houses,
  lands,
}: RecordDetailSectionProps) {
  const { data } = React.use(record);
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
        <Tabs defaultValue="info">
          <TabsList className="">
            <TabsTrigger value="info">Thông tin chung</TabsTrigger>
            <TabsTrigger value="contract">
              Quá trình biên chế, hợp đồng
            </TabsTrigger>
            <TabsTrigger value="commendationAndDiscipline">
              Quá trình khen thưởng và kỷ luật
            </TabsTrigger>
            <TabsTrigger value="education">
              Quá trình đào tạo và bồi dưỡng
            </TabsTrigger>
            <TabsTrigger value="workExperience">Quá trình công tác</TabsTrigger>
            <TabsTrigger value="salary">
              Quá trình lương và phụ cấp (Hoàn cảnh kinh tế)
            </TabsTrigger>
            <TabsTrigger value="relationship">Hồ sơ nhân thân</TabsTrigger>
          </TabsList>
          <TabsContent value="info">
            <div className="grid grid-cols-2 px-3">
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
            </div>
            <Separator className="my-5" />
            <span className="font-bold block mb-5 text-2xl">
              Cập nhật thông tin
            </span>
            <UpdateInformationForm defaultValues={data} />
          </TabsContent>
          <TabsContent value="contract" className="w-full">
            <RecordContractSection contracts={contracts} id={data?.id || ''} />
          </TabsContent>
          <TabsContent value="commendationAndDiscipline" className="w-full">
            <div>
              <span className="block text-xl font-bold mb-5">
                Quá trình khen thưởng
              </span>
              <Separator />
              <div className="my-5">
                <RecordCommendationsTable
                  recordCommendations={recordCommendations}
                />
              </div>
              <span className="block text-xl font-bold mb-5">
                Quá trình kỷ luật
              </span>
              <Separator />
              <div className="my-5">
                <RecordDisciplinesTable recordDisciplines={recordDisciplines} />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="education" className="w-full">
            <RecordEducationSection
              record={data}
              professions={professions}
              trainings={trainings}
            />
          </TabsContent>
          <TabsContent value="workExperience" className="w-full">
            <RecordWorkExperienceTable
              workExperiences={workExperiences}
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
              houses={houses}
              salaries={salaries}
              allowances={allowances}
              lands={lands}
              id={data?.id || ''}
            />
          </TabsContent>
        </Tabs>
      </MainContent>
    </ContentLayout>
  );
}
