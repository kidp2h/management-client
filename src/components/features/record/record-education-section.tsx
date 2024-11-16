import { Separator } from '@/components/ui/separator';
import {
  getProfessionsRecordById,
  getRecordById,
  getTrainingsRecordById,
} from '@/db/queries/records';
import React from 'react';
import RecordProfessionTable from './profession/record-profession-table';
import RecordTrainingTable from './training/record-training-table';

export interface RecordEducationSectionProps {
  record: Awaited<ReturnType<typeof getRecordById>>['data'];
  trainings: ReturnType<typeof getTrainingsRecordById>;
  professions: ReturnType<typeof getProfessionsRecordById>;
}
export default function RecordEducationSection({
  record,
  trainings,
  professions,
}: RecordEducationSectionProps) {
  return (
    <div className="mt-5">
      <span className="block text-xl font-bold mb-5">Trình độ hiện tại</span>
      <Separator />
      <div className="w-full grid-cols-3 grid my-5">
        <div className="flex items-center gap-3">
          <span className="font-bold">Trình độ chuyên môn</span>
          <span className="text-blue-500">{record?.degree}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold">Trình độ Tin học</span>
          <span className="text-blue-500">
            {record?.technologyCertification || 'Chưa cập nhật'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-bold">Trình độ tiếng Anh</span>
          <span className="text-blue-500">
            {record?.englishCertification || 'Chưa cập nhật'}
          </span>
        </div>
      </div>
      <span className="block text-xl font-bold mb-5">
        I. Quá trình đào tạo, chuyên môn
      </span>
      <Separator />
      <div className="my-5">
        <RecordProfessionTable
          professions={professions}
          id={record?.id || ''}
        />
      </div>
      <span className="block text-xl font-bold mb-5">
        II. Quá trình bồi dưỡng nghiệp vụ
      </span>
      <Separator />
      <div className="my-5">
        <RecordTrainingTable trainings={trainings} id={record?.id || ''} />
      </div>
    </div>
  );
}
