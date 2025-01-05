import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import type { ColumnDef } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { encode } from 'js-base64';
import {
  Cake,
  CaseUpper,
  Check,
  Dna,
  Droplet,
  HeartPulse,
  Map,
  ScanBarcode,
  Timer,
  TypeOutline,
  University,
  Users,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { toast } from 'sonner';

import { UpdateDataSheet } from '@/components/common/update-data-sheet';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { updateRecord } from '@/db/actions/records';
import { cn } from '@/lib/utils';

import { DeleteRecordsDialog } from './delete-record-dialog';
import UpdateRecordForm from './update-record-form';
import { getAllReligions } from '@/db/queries/religions';
import { enumBloodType } from '@/db/schema';
import { getAllEthnicities } from '@/db/queries/ethnicities';
import { MobilizationRecordDialog } from './mobilization-record-dialog';
import { getAllDepartments } from '@/db/queries/departments';
import { useGlobalStore } from '@/providers/global-store-provider';
import { useUser } from '@clerk/nextjs';
import { SendRecordDialog } from './send-record-dialog';
import { getAllQualifications } from '@/db/queries/qualifications';
import { CreateDataDialog } from '@/components/common/create-data-dialog';
import CreateWorkExperienceForm from '../record/work-experience/create-work-experience-form';
import { getAllDuties } from '@/db/queries/duties';
import CreateCommendationForm from '../record/commendation/create-commendation-form';
import { getAllAppellations } from '@/db/queries/appellations';
import CreateDisciplineForm from '../record/discipline/create-discipline-form';
import { getAllFormDisciplines } from '@/db/queries/form-disciplines';

export interface DataColumnsRecords {}

export function getColumns(
  religions: ReturnType<typeof getAllReligions>,
  provinces: any[],
  ethnicities: ReturnType<typeof getAllEthnicities>,
  qualification: ReturnType<typeof getAllQualifications>,
  departments: ReturnType<typeof getAllDepartments>,
  duties: ReturnType<typeof getAllDuties>,
  appellations: ReturnType<typeof getAllAppellations>,
  formDisciplines: ReturnType<typeof getAllFormDisciplines>,
  cDepartment: Record<string, string>,
  isAll?: boolean,
): ColumnDef<any>[] {
  // console.log(provinces);
  return [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-0.5 border-none bg-card-foreground"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-0.5 border-none bg-card-foreground"
        />
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'code',
      meta: {
        label: 'Mã hồ sơ',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <ScanBarcode className="mr-2 size-5 text-muted-foreground" />

          <DataTableColumnHeader column={column} title="Mã hồ sơ" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="w-full font-mono">
          {/* <pre>{JSON.stringify(row.original, null, 2)}</pre> */}
          {row.getValue('code')}
        </div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'fullName',
      meta: {
        label: 'Họ và tên',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <TypeOutline className="mr-2 size-5 text-pink-500" />
          <DataTableColumnHeader column={column} title="Họ và tên" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="w-fit">{row.getValue('fullName')}</div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'gender',
      meta: {
        label: 'Giới tính',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <Dna className="mr-2 size-5 text-pink-900" />
          <DataTableColumnHeader column={column} title="Giới tính" />
        </div>
      ),
      cell: ({ row }) => (
        <Badge
          roundedType="md"
          variant="outline"
          className={cn(
            'text-white',
            row.getValue('gender') === 'Nam' ? 'bg-emerald-500' : 'bg-pink-500',
          )}
        >
          {row.getValue('gender') || 'Chưa cập nhật'}
        </Badge>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'religion',
      meta: {
        label: 'Tôn giáo',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <University className="mr-2 size-5 text-indigo-500" />
          <DataTableColumnHeader column={column} title="Tôn giáo" />
        </div>
      ),
      cell: ({ row, cell }) => (
        <Badge
          roundedType="md"
          variant="outline"
          className={cn(
            ' text-card-foreground',
            row.original.religion?.name
              ? 'bg-indigo-500 text-white'
              : 'bg-none',
          )}
        >
          {(row.original.religion?.name as string) || 'Chưa cập nhật'}
        </Badge>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'ethnicity',
      meta: {
        label: 'Dân tộc',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <Users className="mr-2 size-5 text-amber-500" />
          <DataTableColumnHeader column={column} title="Dân tộc" />
        </div>
      ),
      cell: ({ row, cell }) => (
        <Badge
          roundedType="md"
          variant="outline"
          className={cn(
            ' text-card-foreground',
            row.original.ethnicity?.name
              ? 'bg-amber-500 text-white'
              : 'bg-none',
          )}
        >
          {(row.original.ethnicity?.name as string) || 'Chưa cập nhật'}
        </Badge>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'birthday',
      meta: {
        label: 'Ngày sinh',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <Cake className="mr-2 size-5 text-red-500" />
          <DataTableColumnHeader column={column} title="Ngày sinh" />
        </div>
      ),
      cell: ({ cell }) => (
        <div className="flex w-full items-center">
          <span>{dayjs(cell.getValue() as Date).format('D-MM-YYYY')}</span>
        </div>
      ),
    },
    {
      accessorKey: 'birthPlace',
      meta: {
        label: 'Nơi sinh',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <Map className="mr-2 size-5 text-teal-500" />
          <DataTableColumnHeader column={column} title="Nơi sinh" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex w-full items-center">
          <Badge
            roundedType="md"
            variant="outline"
            className={cn(
              'text-card-foreground',
              row.getValue('birthPlace') ? 'bg-teal-500 text-white' : 'bg-none',
            )}
          >
            {row.getValue('birthPlace') || 'Chưa cập nhật'}
          </Badge>
        </div>
      ),
    },
    {
      accessorKey: 'bloodType',
      meta: {
        label: 'Nhóm máu',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <HeartPulse className="mr-2 size-5 text-red-500" />
          <DataTableColumnHeader column={column} title="Nhóm máu" />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex w-full items-center">
          <Badge
            roundedType="md"
            variant="outline"
            className={cn(
              'text-card-foreground',
              row.getValue('bloodType') ? 'bg-red-500 text-white' : 'bg-none',
            )}
          >
            {row.getValue('bloodType') || 'Chưa cập nhật'}
          </Badge>
        </div>
      ),
    },

    {
      accessorKey: 'createdAt',
      meta: {
        label: 'Ngày tạo',
      },
      header: ({ column }) => (
        <div className="flex flex-row items-center gap-1 ">
          <Timer className="mr-2 size-5 text-orange-500" />
          <DataTableColumnHeader column={column} title="Ngày tạo" />
        </div>
      ),
      cell: ({ cell }) => (
        <div className="flex w-fit items-center">
          <span className="flex flex-row items-center gap-2 whitespace-nowrap">
            <Badge roundedType="md" variant="outline">
              {dayjs(cell.getValue() as Date).format('D-MM-YYYY')}
            </Badge>
            {dayjs(cell.getValue() as Date).format('hh:mm:ss')}
          </span>
        </div>
      ),
    },
    {
      id: 'actions',
      cell: function Cell({ row }) {
        const [showUpdateRecordSheet, setShowUpdateRecordSheet] =
          React.useState(false);
        const [showDeleteRecordDialog, setShowDeleteRecordDialog] =
          React.useState(false);
        const [showMobilizationRecordDialog, setShowMobilizationRecordDialog] =
          React.useState(false);
        const [showTransferRecordDialog, setShowTransferRecordDialog] =
          React.useState(false);
        const [showCommendationRecordDialog, setShowCommendationRecordDialog] =
          React.useState(false);
        const [showDisciplineRecordDialog, setShowDisciplineRecordDialog] =
          React.useState(false);
        const [showSendRecordDialog, setShowSendRecordDialog] =
          React.useState(false);
        React.useEffect(() => {});
        const router = useRouter();
        const [isUpdatePending, startUpdateTransition] = React.useTransition();
        const { data: dataReligions } = React.use(religions);
        const { data: dataEthnicities } = React.use(ethnicities);
        const { user } = useUser();
        const { setRoleAdmin, roleAdmin, roleApprove } = useGlobalStore(
          state => state,
        );
        const userRoles: any = user?.publicMetadata.role || [];
        const isCanApprove = userRoles?.some(role =>
          roleApprove?.includes(role?.id),
        );
        return (
          <>
            <UpdateDataSheet
              open={showUpdateRecordSheet}
              onOpenChange={setShowUpdateRecordSheet}
              data={row.original}
              form={UpdateRecordForm}
              name="hồ sơ"
              fieldConfig={{
                fullName: {
                  inputProps: {
                    type: 'text',
                    placeholder: row.original.fullName,
                    defaultValue: row.original.fullName,
                  },
                  icon: CaseUpper,
                },
                bloodType: {
                  inputProps: {
                    placeholder: row.original.bloodType,
                    defaultValue: row.original.bloodType,
                  },
                  icon: Droplet,
                },
                birthday: {
                  inputProps: {
                    // date: row.original.birthday,
                    placeholder: dayjs(row.original.birthday).format(
                      'DD-MM-YYYY',
                    ),
                  },
                },

                englishCertification: {
                  inputProps: {
                    placeholder: row.original.englishCertification,
                    defaultValue: row.original.englishCertification,
                  },
                },
                technologyCertification: {
                  inputProps: {
                    placeholder: row.original.technologyCertification,
                    defaultValue: row.original.technologyCertification,
                  },
                },
                religion: {
                  inputProps: {
                    placeholder: row.original.religion,
                    defaultValue: row.original.religion,
                  },
                },

                isPartyMember: {
                  inputProps: {
                    defaultChecked: row.original.isPartyMember,
                  },
                },
                gender: {
                  inputProps: {
                    placeholder: row.original.gender,
                    defaultValue: row.original.gender,
                  },
                },
                qualification: {
                  inputProps: {
                    placeholder: row.original.qualification,
                    defaultValue: row.original.qualification,
                  },
                },
              }}
            />
            {!isAll && (
              <>
                <MobilizationRecordDialog
                  row={row.original}
                  currentDepartment={cDepartment}
                  open={showMobilizationRecordDialog}
                  onOpenChange={setShowMobilizationRecordDialog}
                  departments={departments}
                  onSuccess={() => row.toggleSelected(false)}
                />
                <CreateDataDialog
                  name="thuyên chuyển nội bộ"
                  form={CreateWorkExperienceForm}
                  description="Tạo thuyên chuyển nội bộ mới"
                  showTrigger={false}
                  _open={showTransferRecordDialog}
                  _onOpenChange={setShowTransferRecordDialog}
                  data={{
                    recordId: row.original.record.id,
                    departments,
                    duties,
                  }}
                />
                <SendRecordDialog
                  qualifications={qualification}
                  row={row.original}
                  currentDepartment={cDepartment}
                  open={showSendRecordDialog}
                  onOpenChange={setShowSendRecordDialog}
                  onSuccess={() => row.toggleSelected(false)}
                />
                <CreateDataDialog
                  name="khen thưởng"
                  form={CreateCommendationForm}
                  description="Tạo khen thưởng mới"
                  showTrigger={false}
                  _open={showCommendationRecordDialog}
                  _onOpenChange={setShowCommendationRecordDialog}
                  data={{
                    recordId: row.original.record.id,
                    appellations,
                  }}
                />
                <CreateDataDialog
                  name="kỷ luật"
                  form={CreateDisciplineForm}
                  description="Tạo kỷ luật mới"
                  showTrigger={false}
                  _open={showDisciplineRecordDialog}
                  _onOpenChange={setShowDisciplineRecordDialog}
                  data={{
                    recordId: row.original.record.id,
                    departments,
                    formDisciplines,
                  }}
                />
              </>
            )}

            <DeleteRecordsDialog
              name="hồ sơ"
              open={showDeleteRecordDialog}
              onOpenChange={setShowDeleteRecordDialog}
              records={[row.original.record]}
              cDepartment={cDepartment}
              showTrigger={false}
              onSuccess={() => row.toggleSelected(false)}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Open menu"
                  variant="ghost"
                  className="flex size-8  p-0 "
                >
                  <DotsHorizontalIcon className="size-4" aria-hidden="true" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-40 h-80 overflow-y-auto"
              >
                <DropdownMenuItem
                  onSelect={() =>
                    router.replace(`/record/${encode(row.original.record.id)}`)
                  }
                >
                  Xem chi tiết
                </DropdownMenuItem>
                <DropdownMenuLabel className="text-xs font-bold uppercase text-muted-foreground">
                  Thao tác
                </DropdownMenuLabel>
                {/* {isCanApprove && ( */}
                {!isAll && (
                  <>
                    <DropdownMenuItem
                      onSelect={() => setShowMobilizationRecordDialog(true)}
                    >
                      Điều động
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setShowTransferRecordDialog(true)}
                    >
                      Thuyên chuyển nội bộ
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setShowCommendationRecordDialog(true)}
                    >
                      Khen thưởng
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={() => setShowDisciplineRecordDialog(true)}
                    >
                      Kỷ luật
                    </DropdownMenuItem>

                    {/* )} */}
                    {/* {isCanApprove && ( */}
                    <DropdownMenuItem onSelect={() => console.log('')}>
                      Bình bầu
                    </DropdownMenuItem>
                    {/* )} */}
                    {/* {isCanApprove && ( */}
                    <DropdownMenuItem
                      onSelect={() => setShowSendRecordDialog(true)}
                    >
                      Cử đi học
                    </DropdownMenuItem>
                  </>
                )}
                {/* )} */}
                <DropdownMenuItem
                  onSelect={() => setShowUpdateRecordSheet(true)}
                >
                  Sửa
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={() => setShowDeleteRecordDialog(true)}
                >
                  Xoá
                  {/* <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut> */}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-bold uppercase text-muted-foreground">
                  Chỉnh sửa nhanh
                </DropdownMenuLabel>

                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Tôn giáo</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      className="h-72 overflow-y-auto"
                      value={row.original.label}
                      onValueChange={value => {
                        startUpdateTransition(() => {
                          if (value) {
                            toast.promise(
                              updateRecord({
                                id: row.original.record.id,
                                religion: value,
                              }),
                              {
                                loading: 'Đang cập nhật...',
                                success: 'Cập nhật thành công',
                                error: 'Cập nhật thất bại',
                              },
                            );
                          }
                        });
                      }}
                    >
                      {dataReligions?.map(rel => (
                        <DropdownMenuRadioItem
                          key={rel.id}
                          value={rel.id}
                          disabled={
                            isUpdatePending ||
                            rel.id === row.original.religion?.id
                          }
                        >
                          <div className="flex flex-row items-center justify-center gap-2">
                            {rel.name}
                            {rel.id === row.original.religion?.id && (
                              <Check className="size-4" />
                            )}
                          </div>
                        </DropdownMenuRadioItem>
                      )) || []}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Dân tộc</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      className="h-72 overflow-y-auto"
                      value={row.original.label}
                      onValueChange={value => {
                        startUpdateTransition(() => {
                          if (value) {
                            toast.promise(
                              updateRecord({
                                id: row.original.record.id,
                                ethnicity: value,
                              }),
                              {
                                loading: 'Đang cập nhật...',
                                success: 'Cập nhật thành công',
                                error: 'Cập nhật thất bại',
                              },
                            );
                          }
                        });
                      }}
                    >
                      {dataEthnicities?.map(b => (
                        <DropdownMenuRadioItem
                          key={b.id}
                          value={b.id}
                          disabled={
                            isUpdatePending ||
                            b.id === row.original.ethnicity?.id
                          }
                        >
                          <div className="flex flex-row items-center justify-center gap-2">
                            {b.name}
                            {b.id === row.original.ethnicity?.id && (
                              <Check className="size-4" />
                            )}
                          </div>
                        </DropdownMenuRadioItem>
                      )) || []}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Nhóm máu</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={row.original.label}
                      onValueChange={value => {
                        startUpdateTransition(() => {
                          if (value) {
                            toast.promise(
                              updateRecord({
                                id: row.original.record.id,
                                bloodType: value,
                              }),
                              {
                                loading: 'Đang cập nhật...',
                                success: 'Cập nhật thành công',
                                error: 'Cập nhật thất bại',
                              },
                            );
                          }
                        });
                      }}
                    >
                      {enumBloodType?.map(b => (
                        <DropdownMenuRadioItem
                          key={b}
                          value={b}
                          disabled={
                            isUpdatePending || b === row.original.bloodType
                          }
                        >
                          <div className="flex flex-row items-center justify-center gap-2">
                            {b}
                            {b === row.original.bloodType && (
                              <Check className="size-4" />
                            )}
                          </div>
                        </DropdownMenuRadioItem>
                      )) || []}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Nơi sinh</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      className="h-72 overflow-y-auto"
                      value={row.original.label}
                      onValueChange={value => {
                        startUpdateTransition(() => {
                          if (value) {
                            toast.promise(
                              updateRecord({
                                id: row.original.record.id,
                                birthPlace: value,
                              }),
                              {
                                loading: 'Đang cập nhật...',
                                success: 'Cập nhật thành công',
                                error: 'Cập nhật thất bại',
                              },
                            );
                          }
                        });
                      }}
                    >
                      {provinces?.map(b => (
                        <DropdownMenuRadioItem
                          key={b.name}
                          value={b.name}
                          disabled={
                            isUpdatePending || b === row.original.birthPlace
                          }
                        >
                          <div className="flex flex-row items-center justify-center gap-2">
                            {b.name}
                            {b === row.original.birthPlace && (
                              <Check className="size-4" />
                            )}
                          </div>
                        </DropdownMenuRadioItem>
                      )) || []}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Giới tính</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      className="h-fit overflow-y-auto"
                      value={row.original.label}
                      onValueChange={value => {
                        startUpdateTransition(() => {
                          if (value) {
                            toast.promise(
                              updateRecord({
                                id: row.original.record.id,
                                gender: value,
                              }),
                              {
                                loading: 'Đang cập nhật...',
                                success: 'Cập nhật thành công',
                                error: 'Cập nhật thất bại',
                              },
                            );
                          }
                        });
                      }}
                    >
                      {['Nam', 'Nữ']?.map(b => (
                        <DropdownMenuRadioItem
                          key={b}
                          value={b}
                          disabled={
                            isUpdatePending || b === row.original.gender
                          }
                        >
                          <div className="flex flex-row items-center justify-center gap-2">
                            {b}
                            {b === row.original.gender && (
                              <Check className="size-4" />
                            )}
                          </div>
                        </DropdownMenuRadioItem>
                      )) || []}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                {/* <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Cấp bậc</DropdownMenuSubTrigger>
                </DropdownMenuSub> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        );
      },
      size: 40,
    },
  ];
}
