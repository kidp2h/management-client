import DashboardSection from '@/components/features/dashboard/dashboard-section';
import {
  getCountRecords,
  getCountRecordsDisciplined,
  getCountRecordsRetired,
  getRecordsDisciplinedRecent3Months,
  getRecordsRecent7Days,
  getRecordsRetiredRecent3Months,
} from '@/db/queries/records';

export default async function DashboardPage() {
  const [
    totalRecords,
    totalRecordsDisciplined,
    totalRecordsRetired,
    recordsDisciplinedRecent3Months,
    recordsRetiredRecent3Months,
    recordsRecent7Days,
  ] = await Promise.all([
    getCountRecords(),
    getCountRecordsDisciplined(),
    getCountRecordsRetired(),
    getRecordsDisciplinedRecent3Months(),
    getRecordsRetiredRecent3Months(),
    getRecordsRecent7Days(),
  ]);
  return (
    <DashboardSection
      data={{
        overview: {
          totalRecords: totalRecords.data,
          totalRecordsDisciplined: totalRecordsDisciplined.data,
          totalRecordsRetired: totalRecordsRetired.data,
        },
        recent3Months: {
          recordsDisciplinedRecent3Months,
          recordsRetiredRecent3Months,
        },
        recent7Days: recordsRecent7Days,
      }}
    />
  );
}
