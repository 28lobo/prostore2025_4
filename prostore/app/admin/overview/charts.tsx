"use client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

type Point = { month: string; totalSales: number | null };

export default function Charts({
  data: { salesData },
}: {
  data: { salesData: Point[] };
}) {
  // 1) Clean or filter out NaNs
  const cleanData = salesData.map(({ month, totalSales }) => ({
    month,
    totalSales:
      typeof totalSales === "number" && !isNaN(totalSales)
        ? totalSales
        : 0,
  }));

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={cleanData}>
          <XAxis dataKey="month" stroke="#888888" tickLine={false} axisLine={false}/>
          <YAxis
            stroke="#888888"
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${v}`}
          />
          <Tooltip formatter={(v: number) => `$${v}`} />
          <Bar dataKey="totalSales" fill="#000000" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
