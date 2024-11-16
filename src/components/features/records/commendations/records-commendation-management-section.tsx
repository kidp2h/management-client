'use client';
import { ChevronDown, ChevronUp } from 'lucide-react';
import React, { Suspense } from 'react';

import AutoBreadcrumb from '@/components/common/auto-breadcrumb';
import MainContent from '@/components/common/main-content';
import { DataTableSkeleton } from '@/components/data-table/data-table-skeleton';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';
import type { getRecordsCommendation } from '@/db/queries/commendation';
import type { _getRecords } from '@/db/queries/records';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import RecordsCommendateForm from './records-commendate-form';
import RecordsCommendationTable from './records-commendation-table';

type RecordsCommendationManagementSectionProps = {
  records: ReturnType<typeof _getRecords>;
  recordsCommendation: ReturnType<typeof getRecordsCommendation>;
};
export const RecordsCommendationManagementSection = ({
  records,
  recordsCommendation,
}: RecordsCommendationManagementSectionProps) => {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Thi đua và khen thưởng' },
  ];
  const [openTable, setOpenTable] = React.useState(false);
  return (
    <ContentLayout title="Thi đua và khen thưởng">
      <AutoBreadcrumb items={items} />
      <MainContent>
        <RecordsCommendateForm records={records} />
        <Separator className="my-4" />
        <Collapsible onOpenChange={setOpenTable} defaultOpen className="mb-5">
          <CollapsibleTrigger className="mb-3 flex w-full flex-row items-center justify-between rounded-md bg-muted p-2 text-card-foreground">
            Danh sách khen thưởng cán bộ
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
                <RecordsCommendationTable
                  recordsCommendation={recordsCommendation}
                />
              </Suspense>
            </TableProvider>
          </CollapsibleContent>
        </Collapsible>
      </MainContent>
    </ContentLayout>
  );
};
