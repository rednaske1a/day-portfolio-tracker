
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";
import { ProductivityEntry } from "./EntryForm";
import { format, subDays, isSameDay } from "date-fns";

interface ProductivityChartProps {
  entries: ProductivityEntry[];
  days?: number;
}

type ChartData = {
  name: string;
  value: number;
  date: Date;
};

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 border border-white/10 shadow-lg text-sm">
        <p className="font-semibold">{format(new Date(label), "MMM d")}</p>
        <p className="font-mono text-productivity-high">
          Score: {payload[0].value}/10
        </p>
      </div>
    );
  }

  return null;
};

export const ProductivityChart: React.FC<ProductivityChartProps> = ({ entries, days = 7 }) => {
  const data = useMemo(() => {
    const today = new Date();
    // Create an array representing the last [days] days
    const dateRange = Array.from({ length: days }, (_, i) => {
      const date = subDays(today, days - 1 - i);
      return {
        name: format(date, "MMM d"),
        value: 0,
        date,
      };
    });

    // Fill in scores for days that have entries
    entries.forEach(entry => {
      const entryDate = new Date(entry.date);
      const dayData = dateRange.find(d => isSameDay(d.date, entryDate));
      if (dayData) {
        // If multiple entries on the same day, use the average
        if (dayData.value > 0) {
          dayData.value = (dayData.value + entry.score) / 2;
        } else {
          dayData.value = entry.score;
        }
      }
    });

    return dateRange;
  }, [entries, days]);

  const averageScore = useMemo(() => {
    if (entries.length === 0) return 0;
    const sum = entries.reduce((acc, entry) => acc + entry.score, 0);
    return Math.round((sum / entries.length) * 10) / 10;
  }, [entries]);

  return (
    <Card className="glass-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex justify-between items-center">
          Productivity Trend
          <span className="text-base font-mono">
            Avg: <span className="font-semibold">{averageScore}/10</span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 pt-2 h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34D399" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              domain={[0, 10]} 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              dx={-10}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#34D399"
              strokeWidth={2}
              fill="url(#colorScore)"
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
