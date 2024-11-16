import { Separator } from '@/components/ui/separator';
import React from 'react';
import RecordRelationshipTable from './record-relationship-table';
import { getRelationshipRecordById } from '@/db/queries/records';

export interface RecordRelationshipSectionProps {
  relationships: ReturnType<typeof getRelationshipRecordById>;
  id: string;
}
export default function RecordRelationshipSection({
  relationships,
  id,
}: RecordRelationshipSectionProps) {
  const self = relationships?.then(r => {
    return r.data.filter(_ => _.type === 'Bản thân');
  });
  const remains = relationships?.then(r => {
    return r.data.filter(_ => _.type !== 'Bản thân');
  });
  return (
    <div className="mt-10">
      <span className="block text-xl font-bold mb-5">
        I. Quan hệ gia đình - về bản thân: Cha, Mẹ, Vợ (hoặc Chồng), các con,
        anh chị em ruột
      </span>
      <Separator />
      <div className="my-5">
        <RecordRelationshipTable
          relationships={relationships}
          id={id}
          type="Bản thân"
          filter={relationships => {
            return relationships.filter((_: any) => _.type === 'Bản thân');
          }}
        />
      </div>
      <span className="block text-xl font-bold mb-5">
        II. Quan hệ gia đình - anh chị em ruột (bên Vợ hoặc Chồng)
      </span>
      <Separator />
      <div className="my-5">
        <RecordRelationshipTable
          relationships={relationships}
          id={id}
          type=""
          filter={relationships => {
            return relationships.filter((_: any) => _.type !== 'Bản thân');
          }}
        />
      </div>
    </div>
  );
}
