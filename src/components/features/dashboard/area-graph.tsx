'use client';

import React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ChartConfig } from '@/components/ui/chart';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

const chartConfig = {
  pending: {
    label: 'Pending',
    color: 'hsl(var(--chart-1))',
  },
  completed: {
    label: 'Completed',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;
export interface AreaGraphProps {
  data: {};
}
export function AreaGraph({ data }: AreaGraphProps) {
  // const chartData = data.applicationsRecent6Months;
  // const dateRange = React.useMemo(() => {
  //   const endDate = new Date();
  //   const startDate = subMonths(endDate, 5);
  //   return eachMonthOfInterval({ start: startDate, end: endDate });
  // }, []);
  // const formattedData = React.useMemo(() => {
  //   return dateRange.map(date => {
  //     const formattedDate = format(date, 'MMMM', {
  //       locale: vi,
  //     });
  //     const dataForDate = chartData.find(
  //       item =>
  //         format(new Date(item.date), 'MMMM', {
  //           locale: vi,
  //         }) === formattedDate,
  //     );
  //     return {
  //       month: formattedDate,
  //       pending: dataForDate?.pending || '0',
  //       completed: dataForDate?.completed || '0',
  //     };
  //   });
  // }, [chartData, dateRange]);
  return (
    <div className="col-span-4  lg:col-span-full">
      <Card className="size-full">
        <CardHeader>
          <CardTitle>Biểu đồ miền</CardTitle>
          <CardDescription>Hiển thị đơn trong 6 tháng trước</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[310px] w-full"
          >
            <AreaChart
              accessibilityLayer
              data={[]}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={value => value}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Area
                dataKey="completed"
                type="natural"
                fill="var(--color-completed)"
                fillOpacity={0.4}
                stroke="var(--color-completed)"
                stackId="a"
              />
              <Area
                dataKey="pending"
                type="natural"
                fill="var(--color-pending)"
                fillOpacity={0.4}
                stroke="var(--color-pending)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-start gap-2 text-sm">
            <div className="grid gap-2">
              <div className="flex items-center gap-2 leading-none text-muted-foreground">
                {/* January - June 2024 */}
              </div>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
