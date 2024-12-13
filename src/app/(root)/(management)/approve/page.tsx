import { ApproveSection } from '@/components/features/approve/approve-section';
import { getAllApproves } from '@/db/queries/approves';

export default function PageApprove() {
  const approves = getAllApproves();
  return <ApproveSection approves={approves} />;
}
