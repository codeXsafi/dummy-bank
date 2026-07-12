"use client";

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Transaction } from "@/app/api/transaction-history/route";
import { formatShortDate } from "@/lib/format";

export function BalanceTrendChart({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const chronological = [...transactions].reverse();
  const data = chronological.map((t, index) => {
    const balance = chronological
      .slice(0, index + 1)
      .reduce((sum, tx) => sum + tx.amount, 0);
    return {
      date: formatShortDate(t.date),
      balance: Number(balance.toFixed(2)),
    };
  });

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="balanceTrendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#CDB17E" stopOpacity={0.35} />
            <stop
              offset="100%"
              stopColor="var(--color-accent)"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" stroke="var(--color-text-muted)" fontSize={12} />
        <YAxis stroke="var(--color-text-muted)" fontSize={12} width={60} />
        <Tooltip
          formatter={(value) => [`$${Number(value).toFixed(2)}`, "Balance"]}
          contentStyle={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        />
        <Area
          type="monotone"
          dataKey="balance"
          stroke="#CDB17E"
          strokeWidth={2}
          fill="url(#balanceTrendGradient)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
