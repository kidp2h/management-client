import { AuthLayout } from '@/layouts';

export default function __AuthLayout__({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthLayout>{children}</AuthLayout>;
}
