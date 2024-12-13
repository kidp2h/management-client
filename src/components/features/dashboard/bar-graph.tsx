'use client';

import { eachDayOfInterval, format, subDays } from 'date-fns';
import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { ChartConfig } from '@/components/ui/chart';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import CountAnimation from '@/components/ui/count-animation';

const chartConfig = {
  disciplined: {
    label: 'Đã kỷ luật',
    color: 'hsl(var(--chart-1))',
  },
  retired: {
    label: 'Nghỉ hưu',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export interface BarGraphData {
  recordsDisciplinedRecent3Months: any[];
  recordsRetiredRecent3Months: any[];
}

export interface BarGraphProps {
  data: BarGraphData;
}
export function BarGraph({ data }: BarGraphProps) {
  // console.log(data);
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('disciplined');
  // const chartData = data.applicationsRecent3Months;
  const dateRange = React.useMemo(() => {
    const endDate = new Date();
    const startDate = subDays(endDate, 90); // 90 days for approximately 3 months
    return eachDayOfInterval({ start: startDate, end: endDate });
  }, []);
  const formattedData = React.useMemo(() => {
    return dateRange.map(date => {
      const formattedDate = format(date, 'yyyy-MM-dd');
      // const dataForDate = chartData.find(
      //   item => format(new Date(item.date), 'yyyy-MM-dd') === formattedDate,
      // );
      const dataDisciplinedForDate = data.recordsDisciplinedRecent3Months.find(
        item => format(new Date(item.date), 'yyyy-MM-dd') === formattedDate,
      );
      const dataRetiredForDate = data.recordsRetiredRecent3Months.find(
        item => format(new Date(item.date), 'yyyy-MM-dd') === formattedDate,
      );
      return {
        date: formattedDate,
        disciplined: dataDisciplinedForDate?.count || 0,
        retired: dataRetiredForDate?.count || 0,
      };
    });
  }, [data, dateRange]);
  const count = React.useMemo(() => {
    return {
      disciplined: data.recordsDisciplinedRecent3Months.length,
      retired: data.recordsRetiredRecent3Months.length,
    };
  }, [formattedData, activeChart]);
  return (
    <div className="col-span-4">
      <Card className="h-full">
        <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
            <CardTitle>Biểu đồ cột</CardTitle>
            <CardDescription>
              Hiển thị số lượng hồ sơ bị kỷ luật và nghỉ hưu trong 3 tháng gần
              đây
            </CardDescription>
          </div>
          <div className="flex">
            {(['disciplined', 'retired'] as (keyof typeof chartConfig)[]).map(
              key => {
                const chart = key as keyof typeof chartConfig;
                return (
                  <button
                    type="button"
                    key={chart}
                    data-active={activeChart === chart}
                    className="relative flex min-w-32 flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                    onClick={() => setActiveChart(chart)}
                  >
                    <span className="text-xs text-muted-foreground">
                      {chartConfig[chart].label}
                    </span>
                    <CountAnimation
                      number={count[key]}
                      className="text-lg font-bold leading-none sm:text-3xl"
                    />
                  </button>
                );
              },
            )}
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[280px] w-full"
          >
            <BarChart
              accessibilityLayer
              data={formattedData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={value => {
                  const date = new Date(value);
                  return date.toLocaleDateString('vi-VN', {
                    month: 'long',
                    day: '2-digit',
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="views"
                    labelFormatter={value => {
                      return new Date(value).toLocaleDateString('vi-VN', {
                        month: 'long',
                        day: '2-digit',
                        year: 'numeric',
                      });
                    }}
                  />
                }
              />
              <Bar
                dataKey={activeChart}
                fill={`var(--color-${activeChart})`}
                radius={3}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
