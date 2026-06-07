"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type InventoryChartDatum = {
  name: string;
  quantityOnHand: number;
};

export function InventoryBarChart({
  data,
}: {
  data: InventoryChartDatum[];
}) {
  return (
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.10)" />
          <XAxis
            dataKey="name"
            tick={{ fill: "rgba(231,231,231,0.7)", fontSize: 12 }}
            interval={0}
            minTickGap={8}
          />
          <YAxis
            tick={{ fill: "rgba(231,231,231,0.7)", fontSize: 12 }}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(10,10,10,0.9)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          />
          <Bar dataKey="quantityOnHand" fill="rgba(255,255,255,0.35)" radius={8} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

