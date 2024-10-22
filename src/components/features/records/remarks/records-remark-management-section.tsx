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
import type { _getRecords } from '@/db/queries/records';
import type { getRecordsRemark } from '@/db/queries/remarks';
import { ContentLayout } from '@/layouts';
import { TableProvider } from '@/providers/table-provider';

import RecordsRemarkForm from './records-remark-form';
import RecordsRemarkTable from './records-remark-table';

type RecordsRemarkManagementSectionProps = {
  records: ReturnType<typeof _getRecords>;
  recordsRemark: ReturnType<typeof getRecordsRemark>;
};
export const RecordsRemarkManagementSection = ({
  records,
  recordsRemark,
}: RecordsRemarkManagementSectionProps) => {
  const items = [
    { name: 'Trang chủ', href: '/' },
    { isSeparator: true },
    { name: 'Đánh giá' },
  ];
  const [openTable, setOpenTable] = React.useState(false);
  return (
    <ContentLayout title="Đánh giá">
      <AutoBreadcrumb items={items} />
      <MainContent>
        <RecordsRemarkForm records={records} />
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
                <RecordsRemarkTable recordsRemark={recordsRemark} />
              </Suspense>
            </TableProvider>
          </CollapsibleContent>
        </Collapsible>
      </MainContent>
    </ContentLayout>
  );
};
