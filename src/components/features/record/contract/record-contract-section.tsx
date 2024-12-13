import React from 'react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import CollapsibleFancy from '@/components/ui/collapsible-fancy';
import type { getContractsRecordById } from '@/db/queries/records';

import RecordContractTable from './record-contract-table';
import { Badge } from '@/components/ui/badge';
import dayjs from 'dayjs';
import { getAllFormRecruitments } from '@/db/queries/form-recruitments';
import { getAllTypeContracts } from '@/db/queries/type-contracts';

export interface RecordContractSectionProps {
  contracts: ReturnType<typeof getContractsRecordById>;
  formRecruitments: ReturnType<typeof getAllFormRecruitments>;
  typeContracts: ReturnType<typeof getAllTypeContracts>;
  id: string;
}
export default function RecordContractSection({
  contracts,
  formRecruitments,
  typeContracts,
  id,
}: RecordContractSectionProps) {
  const { data } = React.use(contracts);
  const latestContract = React.useMemo(() => {
    return data.filter(contract => {
      if (dayjs().isBetween(dayjs(contract.from), dayjs(contract.to))) {
        return true;
      }
      return false;
    });
  }, [data]);
  return (
    <div className="w-full">
      <CollapsibleFancy name="Trạng thái biên chế, hợp đồng hiện tại">
        <Accordion type="single" collapsible>
          {latestContract.map(contract => (
            <AccordionItem value={contract.id} key={contract.id}>
              <AccordionTrigger>{contract.typeContract}</AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                  <div className="flex flex-row gap-3">
                    <span>Hình thức tuyển dụng</span>
                    <Badge>{contract.typeContract}</Badge>
                  </div>
                  <div className="grid-col-2 grid gap-3">
                    <div className="flex flex-row gap-3">
                      <span>Ngày bắt đầu</span>
                      <Badge>{dayjs(contract.from).format('DD-MM-YYYY')}</Badge>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
          {latestContract.length === 0 && (
            <div className="text-center text-gray-500">
              Không có hợp đồng nào
            </div>
          )}
        </Accordion>
      </CollapsibleFancy>
      <CollapsibleFancy name="Quá trình biên chế hợp đồng">
        <RecordContractTable
          contracts={contracts}
          id={id}
          typeContracts={typeContracts}
          formRecruitments={formRecruitments}
        />
      </CollapsibleFancy>
    </div>
  );
}
