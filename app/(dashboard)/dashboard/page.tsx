/*
 * app/(dashboard)/dashboard/page.tsx — the authenticated landing page.
 */
"use client";

import Link from "next/link";
import { BalanceHeroCard } from "@/components/dashboard/BalanceHeroCard";
import { BalanceTrendChart } from "@/components/dashboard/BalanceTrendChart";
import { IncomeVsSpendingChart } from "@/components/dashboard/IncomeVsSpendingChart";
import { TransactionRow } from "@/components/transactions/TransactionRow";
import { Card } from "@/components/ui/Card";
import { usePageTitle } from "@/lib/usePageTitle";
import { useTransactions } from "@/lib/useTransactions";

export default function DashboardPage() {
  usePageTitle("Dashboard");
  const { transactions, isLoading } = useTransactions();
  const balance = transactions.reduce((sum, t) => sum + t.amount, 0);
  const recent = transactions.slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <BalanceHeroCard
        transactions={transactions}
        balance={balance}
        isLoading={isLoading}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-text">
            Balance trend
          </h2>
          {!isLoading && <BalanceTrendChart transactions={transactions} />}
        </Card>
        <Card>
          <h2 className="mb-4 text-sm font-semibold text-text">
            Income vs Spending
          </h2>
          {!isLoading && <IncomeVsSpendingChart transactions={transactions} />}
        </Card>
      </div>

      <Card>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text">
            Recent transactions
          </h2>
          <Link
            href="/transactions"
            className="text-xs font-medium text-accent hover:underline"
          >
            View all
          </Link>
        </div>
        {isLoading ? (
          <p className="text-sm text-text-muted">Loading…</p>
        ) : (
          recent.map((t) => <TransactionRow key={t.id} transaction={t} />)
        )}
      </Card>
    </div>
  );
}
