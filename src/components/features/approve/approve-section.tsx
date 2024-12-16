import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { ContentLayout } from '@/layouts';
import { ApprovesTable } from './approve-table';
import { getAllApproves } from '@/db/queries/approves';

export interface ApproveSectionProps {
  approves: ReturnType<typeof getAllApproves>;
}
export const ApproveSection = ({ approves }: ApproveSectionProps) => {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Duyệt hồ sơ' },
  ];
  return (
    <ContentLayout title="Duyệt hồ sơ">
      <AutoBreadcrumb items={items} />
      <MainContent hasCard={false}>
        <ApprovesTable approves={approves} />
      </MainContent>
    </ContentLayout>
  );
};
