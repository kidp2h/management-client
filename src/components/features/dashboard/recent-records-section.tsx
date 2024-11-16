import { upperCase } from 'lodash';
import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export interface RecentRecordData {
  recordsRecent7Days: any[];
}

export interface RecentRecordsSectionProps {
  recordsRecent7Days: any[];
}
export default function RecentRecordsSection({
  recordsRecent7Days,
}: RecentRecordsSectionProps) {
  return (
    <Card className="col-span-4 size-full lg:col-span-3">
      <CardHeader>
        <CardTitle>Hồ sơ gần đây</CardTitle>
        <CardDescription>Có được tạo trong 7 ngày gần đây</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-72 overflow-y-scroll">
          <div className="space-y-8 ">
            {recordsRecent7Days.map((record, index) => {
              return (
                <div
                  key={`${record.fullName}${index}`}
                  className="flex items-center px-2"
                >
                  <Avatar className="size-9">
                    <AvatarImage src="/avatars/01.png" alt="Avatar" />
                    <AvatarFallback>
                      {upperCase(record.fullName[0])}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {record.fullName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {record.gender}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
