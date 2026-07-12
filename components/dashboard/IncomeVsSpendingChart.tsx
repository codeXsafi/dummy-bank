"use client";

import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { Transaction } from "@/app/api/transaction-history/route";
import { computeIncomeAndSpending } from "@/lib/transactionTotals";

export function IncomeVsSpendingChart({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const { income, spending } = computeIncomeAndSpending(transactions);

  const data = [
    { name: "Income", value: income, fill: "#34D399" },
    { name: "Spending", value: spending, fill: "#CDB17E" },
  ];

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={12} />
        <YAxis stroke="var(--color-text-muted)" fontSize={12} width={60} />
        <Tooltip
          formatter={(value) => [`$${Number(value).toFixed(2)}`, "Amount"]}
          contentStyle={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
          }}
        />
        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
          {data.map((entry) => (
            <Cell key={entry.name} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
