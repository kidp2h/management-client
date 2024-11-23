import { Separator } from '@/components/ui/separator';
import {
  getRecordById,
  getTrainingsRecordById,
} from '@/db/queries/records';
import React from 'react';
import RecordTrainingTable from './training/record-training-table';
import { getAllQualifications } from '@/db/queries/qualifications';
import { getAllFormTrainings } from '@/db/queries/form-trainings';

export interface RecordEducationSectionProps {
  record: Awaited<ReturnType<typeof getRecordById>>['data'];
  trainings: ReturnType<typeof getTrainingsRecordById>;
  qualifications: ReturnType<typeof getAllQualifications>;
  formTrainings: ReturnType<typeof getAllFormTrainings>;
}
export default function RecordEducationSection({
  record,
  trainings,
  qualifications,
  formTrainings,
}: RecordEducationSectionProps) {
  return (
    <div className="mt-5">
      <span className="block text-xl font-bold mb-5">
        Quá trình đào tạo, bồi dưỡng chuyên môn, nghiệp vụ
      </span>
      <Separator />
      <div className="my-5">
        <RecordTrainingTable
          trainings={trainings}
          id={record?.id || ''}
          qualifications={qualifications}
          formTrainings={formTrainings}
        />
      </div>
    </div>
  );
}
