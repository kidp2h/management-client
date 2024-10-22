'use client';
import { CollapsibleTrigger } from '@radix-ui/react-collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import { Collapsible, CollapsibleContent } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import type { getRecordsDiscipline } from '@/db/queries/disciplines';
import type { _getRecords } from '@/db/queries/records';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import RecordsDisciplineForm from './records-discipline-form';
import RecordsDisciplineTable from './records-disciplines-table';

type RecordsDisciplineManagementSectionProps = {
  records: ReturnType<typeof _getRecords>;
  recordsDiscipline: ReturnType<typeof getRecordsDiscipline>;
};
export const RecordsDisciplineManagementSection = ({
  records,
  recordsDiscipline,
}: RecordsDisciplineManagementSectionProps) => {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Kỷ luật' },
  ];
  const [openTable, setOpenTable] = React.useState(false);
  return (
    <ContentLayout title="Kỷ luật">
      <AutoBreadcrumb items={items} />
      <MainContent>
        <RecordsDisciplineForm records={records} />
        <Separator className="my-4" />
        <Collapsible onOpenChange={setOpenTable} defaultOpen className="mb-5">
          <CollapsibleTrigger className="mb-3 flex w-full flex-row items-center justify-between rounded-md bg-muted p-2 text-card-foreground">
            Danh sách cán bộ bị kỷ luật
            {openTable ? (
              <ChevronDown className="size-5" />
            ) : (
              <ChevronUp className="size-5" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="CollapsibleContent px-5">
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
                <RecordsDisciplineTable recordsDiscipline={recordsDiscipline} />
              </Suspense>
            </TableProvider>
          </CollapsibleContent>
        </Collapsible>
      </MainContent>
    </ContentLayout>
  );
};
