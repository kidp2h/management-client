'use client';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import type {
  getAllRoles,
  getDetailConfigRole,
  getDetailConfigRoleApprove,
  getRoles,
} from '@/db/queries/roles';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { RolesTable } from './roles-table';
import { Separator } from '@/components/ui/separator';
import { Combobox } from '@/components/ui/combobox';
import { User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  removeRoleAdmin,
  removeRoleApprove,
  setRoleAdmin,
  setRoleApprove,
} from '@/db/actions/roles';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export interface RolesManagementSectionProps {
  roles: ReturnType<typeof getRoles>;
  allRoles: ReturnType<typeof getAllRoles>;
  configRole: ReturnType<typeof getDetailConfigRole>;
  configRoleApprove: ReturnType<typeof getDetailConfigRoleApprove>;
}
export default function RolesManagementSection({
  roles,
  configRole,
  allRoles,
  configRoleApprove,
}: RolesManagementSectionProps) {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý danh mục' },
    { isSeparator: true },
    { name: 'Vai trò' },
  ];

  const { data: dataRoles } = React.use(roles);
  const { data: allRolesData } = React.use(allRoles);
  const { data: dataConfigRole } = React.use(configRole);
  const { data: dataConfigRoleApprove } = React.use(configRoleApprove);

  const [selectedRole, setSelectedRole] = React.useState<string>('');
  const [selectedRoleApprove, setSelectedRoleApprove] =
    React.useState<string>('');

  const handleSetRoleAdmin = async () => {
    const { error } = await setRoleAdmin({
      id: selectedRole,
    });
    if (!error) {
      toast.success('Thêm thành công');
    }
  };
  const handleRemoveRoleAdmin = async (id: string) => {
    const { error } = await removeRoleAdmin(id);
    if (!error) {
      toast.success('Xóa thành công');
    }
  };
  const handleSetRoleApprove = async () => {
    const { error } = await setRoleApprove({
      id: selectedRoleApprove,
    });
    if (!error) {
      toast.success('Thêm thành công');
    }
  };
  const handleRemoveRoleApprove = async (id: string) => {
    const { error } = await removeRoleApprove(id);
    if (!error) {
      toast.success('Xóa thành công');
    }
  };
  return (
    <ContentLayout title="Vai trò">
      <AutoBreadcrumb items={items} />
      <MainContent hasCard={false}>
        <TableProvider isHidden>
          <Suspense
            fallback={
              <DataTableSkeleton
                columnCount={3}
                searchableColumnCount={2}
                filterableColumnCount={2}
                cellWidths={['10rem']}
                shrinkZero
              />
            }
          >
            <RolesTable roles={roles} />
          </Suspense>
        </TableProvider>
        <Separator className="my-4" />
        <span className="font-bold">Thêm vai trò làm quản lý</span>
        <Separator className="my-4" />
        <div className="my-5">
          {dataConfigRole?.map((item, index) => (
            <Badge
              key={item?.roles?.id}
              className="mr-2 cursor-pointer"
              onClick={() => {
                if (item?.roles?.id) {
                  handleRemoveRoleAdmin(item?.roles?.id);
                }
              }}
            >
              {item?.roles?.name}
            </Badge>
          ))}
        </div>

        <Combobox
          startIcon={User}
          value={selectedRole}
          setValue={setSelectedRole}
          className="w-52"
          type="normal"
          placeholder="Chọn vai trò làm quản lý"
          dataset={
            allRolesData?.map(r => ({
              label: r.name,
              value: r.id,
            })) || []
          }
        />
        <Button
          className="mt-4"
          onClick={() => {
            handleSetRoleAdmin();
          }}
        >
          Lưu
        </Button>
        <Separator className="my-4" />
        <span className="font-bold">Thêm vai trò duyệt hồ sơ</span>
        <Separator className="my-4" />
        <div className="my-5">
          {dataConfigRoleApprove?.[0].roles !== null &&
            dataConfigRoleApprove?.map((item, index) => (
              <Badge
                key={item?.roles?.id}
                className="mr-2 cursor-pointer"
                onClick={() => {
                  if (item?.roles?.id) {
                    handleRemoveRoleApprove(item?.roles?.id);
                  }
                }}
              >
                {item?.roles?.name}
              </Badge>
            ))}
        </div>

        <Combobox
          startIcon={User}
          value={selectedRoleApprove}
          setValue={setSelectedRoleApprove}
          className="w-52"
          type="normal"
          placeholder="Chọn vai trò làm duyệt hồ sơ"
          dataset={
            allRolesData?.map(r => ({
              label: r.name,
              value: r.id,
            })) || []
          }
        />
        <Button
          className="mt-4"
          onClick={() => {
            handleSetRoleApprove();
          }}
        >
          Lưu
        </Button>
        {/* {selectedRole} */}
      </MainContent>
    </ContentLayout>
  );
}
