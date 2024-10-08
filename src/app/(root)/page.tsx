import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { ContentLayout } from '@/layouts';

export default async function DashboardPage() {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Bảng điều khiển' },
  ];
  return (
    <ContentLayout title="Bảng điều khiển">
      <AutoBreadcrumb items={items} />
      <MainContent>x</MainContent>
    </ContentLayout>
  );
}
