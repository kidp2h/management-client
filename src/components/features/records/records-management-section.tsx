'use client';
import React, { Suspense, useCallback, useEffect, useMemo } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';

import type {
  _getRecords,
  getAllIncreasedSalaryEarly,
  getAllIncreasedSalaryRegular,
  getRecords,
  getRecordsRetired,
  getRecordsRetirement,
} from '@/db/queries/records';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import { RecordsTable } from './records-table';
import { getAllReligions } from '@/db/queries/religions';
import { getAllEthnicities } from '@/db/queries/ethnicities';
import { TreeView } from '@/components/ui/tree-view';
import { BookUser, Cog, FilePlus, GitBranchPlus } from 'lucide-react';
import { getAllDepartments } from '@/db/queries/departments';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MobilizationsTable } from '../mobilizations/mobilization-table';
import { getAllMobilizations } from '@/db/queries/mobilizations';
import { CreateDepartmentsDialog } from '../departments/create-department-dialog';
import CreateRecordDepartmentForm from '../departments/create-record-department-form';
import { FormDialog } from '@/components/common/form-dialog';
import UpdateDepartmentForm from '../departments/update-department-form';
import { getAllFormSalary } from '@/db/queries/form-salary';
import { getAllCivilServantRanks } from '@/db/queries/civil-servant-ranks';
import { getAllSalaryGrades } from '@/db/queries/salary-grades';
import { getAllDuties } from '@/db/queries/duties';
import { flat } from '@/lib/utils';
import IncreaseSalaryRegularSection from '../increase-salary-regular/increase-salary-regular-section';
import IncreaseSalaryEarlySection from '../increase-salary-early/increase-salary-early-section';
import { SendsTable } from '../sends/send-table';
import { getAllQualifications } from '@/db/queries/qualifications';
import { getAllSends } from '@/db/queries/sends';
import { RecordsRetireManagementSection } from './retirements/records-retirement-management-section';
import { getAllAppellations } from '@/db/queries/appellations';
import { getAllFormDisciplines } from '@/db/queries/form-disciplines';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getAllRecordDuals } from '@/db/queries/duals';
import { getAllRecordSecondments } from '@/db/queries/secondments';
import RecordDualsTable from '../record/dual/record-dual-table';
import RecordSecondmentsTable from '../record/secondment/record-secondment-table';
import { RecordsTableAll } from './records-table-all';

type RecordsManagementSectionProps = {
  records: ReturnType<typeof getRecords>;
  recordsExceptDepartment: ReturnType<typeof getRecords>;
  allRecords: ReturnType<typeof _getRecords>;
  religions: ReturnType<typeof getAllReligions>;
  ethnicities: ReturnType<typeof getAllEthnicities>;
  // allRecordsDepartments: ReturnType<typeof getAllRecordsDepartments>;
  allDepartments: ReturnType<typeof getAllDepartments>;
  mobilizations: ReturnType<typeof getAllMobilizations>;
  formSalary: ReturnType<typeof getAllFormSalary>;
  civilServantRanks: ReturnType<typeof getAllCivilServantRanks>;
  salaryGrades: ReturnType<typeof getAllSalaryGrades>;
  duties: ReturnType<typeof getAllDuties>;
  listIncreasedSalaryRegular: ReturnType<typeof getAllIncreasedSalaryRegular>;
  listIncreasedSalaryEarly: ReturnType<typeof getAllIncreasedSalaryEarly>;
  sends: ReturnType<typeof getAllSends>;
  qualifications: ReturnType<typeof getAllQualifications>;
  recordsRetirement: ReturnType<typeof getRecordsRetirement>;
  recordsRetired: ReturnType<typeof getRecordsRetired>;
  appellations: ReturnType<typeof getAllAppellations>;
  formDisciplines: ReturnType<typeof getAllFormDisciplines>;
  recordDuals: ReturnType<typeof getAllRecordDuals>;
  recordSecondments: ReturnType<typeof getAllRecordSecondments>;
};
export const RecordsManagementSection = ({
  records,
  allDepartments,
  religions,
  ethnicities,
  allRecords,
  mobilizations,
  formSalary,
  civilServantRanks,
  salaryGrades,
  duties,
  listIncreasedSalaryRegular,
  listIncreasedSalaryEarly,
  sends,
  qualifications,
  recordsRetirement,
  recordsRetired,
  appellations,
  formDisciplines,
  recordDuals,
  recordSecondments,
  recordsExceptDepartment,
}: RecordsManagementSectionProps) => {
  // const isDesktop = useMediaQuery('(min-width: 1024px)');
  const result = React.use(allDepartments);
  const [cItem, setItem] = React.useState<any>(null);
  const [preItem, setPreItem] = React.useState<any>();
  const [tab, setTab] = React.useState('list');
  const [showCreateDepartmentDialog, setShowCreateDepartmentDialog] =
    React.useState(false);
  const [childOfDepartments, setChildOfDepartments] = React.useState([]);

  const [
    showCreateRecordDepartmentDialog,
    setShowCreateRecordDepartmentDialog,
  ] = React.useState(false);
  const [showUpdateDepartmentDialog, setShowUpdateDepartmentDialog] =
    React.useState(false);
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );
  const pathname = usePathname();
  useEffect(() => {
    const departments = searchParams.get('departments');
    if (departments) {
      const department = flat(result?.data)?.find(d => d.id === departments);
      if (department) {
        setItem(department);
      }
    }
  }, []);
  const addOnClickHandler = items => {
    return items.map(item => {
      const newItem = {
        ...item,
        onClick: () => {
          setItem(item);
          router.push(
            `${pathname}?${createQueryString('departments', item.id)}`,
          );
          // console.log(cItem?.id, item.id, cItem?.id === item.id);
        },
        actions: (
          <div className="flex items-center justify-center gap-2 backdrop-blur-sm p-1 rounded-md border border-muted ">
            <GitBranchPlus
              className="size-5 text-muted-foreground cursor-pointer hover:text-accent-foreground "
              onClick={() => {
                setItem(item);
                setShowCreateDepartmentDialog(true);
              }}
            />
            <BookUser
              className="size-5 text-muted-foreground cursor-pointer hover:text-accent-foreground"
              onClick={() => {
                setItem(item);
              }}
            />
            <FilePlus
              className="size-5 text-muted-foreground cursor-pointer hover:text-accent-foreground"
              onClick={() => {
                setItem(item);
                setShowCreateRecordDepartmentDialog(true);
              }}
            />

            <Cog
              className="size-5 text-muted-foreground cursor-pointer hover:text-accent-foreground "
              onClick={() => {
                setItem(item);
                console.log(items, item);
                setShowUpdateDepartmentDialog(true);
              }}
            />
          </div>
        ),
      };

      if (newItem.children && newItem.children.length > 0) {
        newItem.children = addOnClickHandler(newItem.children);
      }

      return newItem;
    });
  };
  const router = useRouter();

  const resultMapped = useMemo(() => {
    return addOnClickHandler(result?.data || []);
  }, [result]);
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Quản lý hồ sơ' },
  ];

  useEffect(() => {
    setTab('list');

    setChildOfDepartments(
      flat(result?.data || [])?.filter(d => d.parent === cItem?.id) || [],
    );
  }, [cItem]);

  return (
    <ContentLayout title="Quản lý hồ sơ">
      <AutoBreadcrumb items={items} />
      <MainContent>
        <Tabs defaultValue="department">
          <TabsList>
            <TabsTrigger value="all">Tổng</TabsTrigger>
            <TabsTrigger value="department">Danh sách theo khoa</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <RecordsTableAll
              formDisciplines={formDisciplines}
              departments={allDepartments}
              cDepartment={cItem}
              records={recordsExceptDepartment}
              isAll
              qualifications={qualifications}
              religions={religions}
              ethnicities={ethnicities}
              duties={duties}
              appellations={appellations}
            />
          </TabsContent>
          <TabsContent value="department">
            {' '}
            <div className="flex flex-col lg:flex-row gap-3 mb-20 ">
              <TreeView
                data={resultMapped || []}
                initialSelectedItemId={cItem?.id}
                expandAll
                className="w-full lg:w-[30%] h-fit max-h-[70vh] overflow-auto bg-primary-foreground rounded-lg border-muted border-2 border-dashed"
              />
              <CreateDepartmentsDialog
                name="đơn vị"
                cDepartment={cItem}
                open={showCreateDepartmentDialog}
                onOpenChange={setShowCreateDepartmentDialog}
                showTrigger={false}
              />
              <FormDialog
                form={CreateRecordDepartmentForm}
                _open={showCreateRecordDepartmentDialog}
                _onOpenChange={setShowCreateRecordDepartmentDialog}
                showTrigger={false}
                disabled={!cItem}
                data={{
                  records: allRecords,
                  cDepartment: cItem,
                }}
                title="Gán đơn vị cho cán bộ"
                description="Gán đơn vị cho cán bộ"
              />
              <FormDialog
                title="Cập nhật đơn vị"
                form={UpdateDepartmentForm}
                _open={showUpdateDepartmentDialog}
                _onOpenChange={setShowUpdateDepartmentDialog}
                showTrigger={false}
                disabled={!cItem}
                data={{
                  cDepartment: cItem,
                  data: {
                    name: cItem?.name,
                    parent: cItem?.parent,
                  },
                  departments: allDepartments,
                }}
                name="đơn vị"
                description="Cập nhật thông tin đơn vị"
              />
              <div className="w-full lg:w-[70%]">
                <div className="font-bold mb-5">Đơn vị: {cItem?.name}</div>

                {/* <div className="w-full relative h-10"> */}
                <Tabs value={tab} onValueChange={setTab} defaultValue="info">
                  <TabsList className="flex flex-row h-full justify-start items-start w-fit mb-5">
                    <ScrollArea>
                      <TabsTrigger value="list" disabled={cItem === null}>
                        Danh sách trích ngang
                      </TabsTrigger>

                      <TabsTrigger
                        disabled={cItem === null}
                        value="mobilization"
                      >
                        Điều động
                      </TabsTrigger>
                      <TabsTrigger disabled={cItem === null} value="send">
                        Cử đi học
                      </TabsTrigger>
                      <TabsTrigger disabled={cItem === null} value="retire">
                        Nghỉ hưu
                      </TabsTrigger>
                      <TabsTrigger disabled={cItem === null} value="dual">
                        Kiêm nhiệm
                      </TabsTrigger>
                      <TabsTrigger disabled={cItem === null} value="secondment">
                        Biệt phái
                      </TabsTrigger>
                      <TabsTrigger
                        disabled={cItem === null}
                        value="increase-salary-regular"
                      >
                        Nâng lương thường xuyên
                      </TabsTrigger>
                      <TabsTrigger
                        disabled={cItem === null}
                        value="increase-salary-early"
                      >
                        Nâng lương trước hạn
                      </TabsTrigger>
                    </ScrollArea>
                  </TabsList>
                  <TabsContent value="list" className="w-full">
                    {cItem && (
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
                          <RecordsTable
                            formDisciplines={formDisciplines}
                            departments={allDepartments}
                            cDepartment={cItem}
                            isAll={false}
                            records={records}
                            qualifications={qualifications}
                            religions={religions}
                            ethnicities={ethnicities}
                            duties={duties}
                            appellations={appellations}
                          />
                        </Suspense>
                      </TableProvider>
                    )}
                  </TabsContent>
                  <TabsContent value="retire" className="w-full">
                    {/* <TableProvider isHidden>
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
                    <RecordsTable
                      cDepartment={cItem}
                      records={records}
                      religions={religions}
                      ethnicities={ethnicities}
                    />
                  </Suspense>
                </TableProvider> */}
                  </TabsContent>
                  <TabsContent value="mobilization" className="w-full">
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
                        <MobilizationsTable
                          childOfDepartments={childOfDepartments}
                          formSalary={formSalary}
                          duties={duties}
                          civilServantRanks={civilServantRanks}
                          salaryGrades={salaryGrades}
                          departments={allDepartments}
                          cDepartment={cItem}
                          mobilizations={mobilizations}
                        />
                      </Suspense>
                    </TableProvider>
                  </TabsContent>
                  <TabsContent value="send" className="w-full">
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
                        <SendsTable
                          cDepartment={cItem}
                          sends={sends}
                          qualifications={qualifications}
                        />
                      </Suspense>
                    </TableProvider>
                  </TabsContent>
                  <TabsContent
                    value="increase-salary-regular"
                    className="w-full"
                  >
                    <IncreaseSalaryRegularSection
                      cDepartment={cItem}
                      records={records}
                      listIncreasedSalaryRegular={listIncreasedSalaryRegular}
                      salaryGrades={salaryGrades}
                    />
                  </TabsContent>
                  <TabsContent value="increase-salary-early" className="w-full">
                    <IncreaseSalaryEarlySection
                      cDepartment={cItem}
                      records={records}
                      listIncreasedSalaryEarly={listIncreasedSalaryEarly}
                      salaryGrades={salaryGrades}
                    />
                  </TabsContent>
                  <TabsContent value="retire" className="w-full">
                    <RecordsRetireManagementSection
                      recordsRetirement={recordsRetirement}
                      cDepartment={cItem}
                      recordsRetired={recordsRetired}
                    />
                  </TabsContent>
                  <TabsContent value="dual" className="w-full">
                    <RecordDualsTable
                      recordDuals={recordDuals}
                      duties={duties}
                      cDepartment={cItem}
                    />
                  </TabsContent>
                  <TabsContent value="secondment" className="w-full">
                    <RecordSecondmentsTable
                      recordSecondments={recordSecondments}
                      duties={duties}
                      departments={allDepartments}
                      cDepartment={cItem}
                    />
                  </TabsContent>
                </Tabs>
                {/* </div> */}
                {/* <ScrollBar orientation="horizontal" /> */}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* </ResizablePanel>
          </ResizablePanelGroup> */}
        {/* </div> */}
      </MainContent>
    </ContentLayout>
  );
};
