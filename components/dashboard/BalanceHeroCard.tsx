import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { Transaction } from "@/app/api/transaction-history/route";
import { formatCurrency } from "@/lib/format";
import { computeIncomeAndSpending } from "@/lib/transactionTotals";

interface BalanceHeroCardProps {
  transactions: Transaction[];
  balance: number;
  isLoading: boolean;
}

export function BalanceHeroCard({
  transactions,
  balance,
  isLoading,
}: BalanceHeroCardProps) {
  const { income, spending } = computeIncomeAndSpending(transactions);

  return (
    <div className="relative overflow-hidden rounded-lg bg-linear-to-br from-primary to-primary-light p-6 text-text-inverse shadow-sm">
      {/* Decorative glow — token-driven (bg-accent/20 + blur), never a new
          hardcoded color. */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative">
        <p className="text-xs uppercase tracking-wide text-text-inverse/70">
          Total balance
        </p>
        <p className="mt-1 font-serif text-4xl">
          {isLoading ? "…" : formatCurrency(balance, { forceSign: false })}
        </p>
        <p className="mt-1 text-xs text-text-inverse/60">Checking ....4821</p>

        {!isLoading && (
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-success/20 text-success">
                <ArrowUpRight size={14} />
              </span>
              <div>
                <p className="text-text-inverse/60 text-xs font-semibold">
                  Income
                </p>
                <p className="text-success font-bold mt-1">
                  {formatCurrency(income)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-danger/20 text-danger">
                <ArrowDownRight size={14} />
              </span>
              <div>
                <p className="text-text-inverse/60 text-xs font-semibold">
                  Spending
                </p>
                <p className="text-danger font-bold mt-1">
                  {formatCurrency(-spending)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
