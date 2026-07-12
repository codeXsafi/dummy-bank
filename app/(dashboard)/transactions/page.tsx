"use client";

import { useMemo, useState } from "react";
import { TransactionRow } from "@/components/transactions/TransactionRow";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { usePageTitle } from "@/lib/usePageTitle";
import { useTransactions } from "@/lib/useTransactions";

type FilterTab = "all" | "income" | "spending";

const TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "All" },
  { key: "income", label: "Income" },
  { key: "spending", label: "Spending" },
];

export default function TransactionsPage() {
  usePageTitle("Transactions");
  const { transactions, isLoading } = useTransactions();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<FilterTab>("all");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return transactions
      .filter((t) => {
        if (tab === "income") return t.amount > 0;
        if (tab === "spending") return t.amount < 0;
        return true;
      })
      .filter((t) => t.merchant.toLowerCase().includes(query));
  }, [transactions, tab, search]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Input
          placeholder="Search transactions..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <div className="flex gap-2">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                tab === t.key
                  ? "border border-[#E8E2D5] bg-[#F3F2F2] text-primary-light"
                  : "text-text-muted"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <Card>
        {isLoading ? (
          <p className="text-sm text-text-muted">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-text-muted">
            No transactions match your search.
          </p>
        ) : (
          filtered.map((t) => <TransactionRow key={t.id} transaction={t} />)
        )}
      </Card>
    </div>
  );
}
