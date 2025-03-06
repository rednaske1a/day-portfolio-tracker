
import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, TooltipProps } from "recharts";
import { ProductivityEntry } from "@/types/productivity";
import { calculateAverageScore, prepareChartData } from "@/utils/productivityUtils";

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
        <p className="font-semibold">{label}</p>
        <p className="font-mono text-productivity-high">
          Score: {payload[0].value.toFixed(1)}/10
        </p>
      </div>
    );
  }

  return null;
};

export const ProductivityChart: React.FC<ProductivityChartProps> = ({ entries, days = 7 }) => {
  const data = useMemo(() => prepareChartData(entries, days), [entries, days]);
  const averageScore = useMemo(() => calculateAverageScore(entries), [entries]);

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
