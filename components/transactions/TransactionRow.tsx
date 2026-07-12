/*
 * TransactionRow — one line-item, shared between the dashboard's "recent
 * transactions" preview and the full /transactions list, so the two never
 * visually drift apart. The category icon/tint comes from
 * lib/categoryIcons.ts, the single source of truth for that mapping.
 */
import type { Transaction } from "@/app/api/transaction-history/route";
import { categoryStyle } from "@/lib/categoryIcons";
import { formatCurrency, formatShortDate } from "@/lib/format";

export function TransactionRow({ transaction }: { transaction: Transaction }) {
  const isIncome = transaction.amount > 0;
  const { icon: Icon, tintClassName } = categoryStyle(transaction.category);

  return (
    <div className="flex items-center justify-between border-b border-border py-3 last:border-b-0">
      <div className="flex items-center gap-3">
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${tintClassName}`}
          aria-hidden="true"
        >
          <Icon size={16} />
        </span>
        <div>
          <p className="text-sm font-medium text-text">
            {transaction.merchant}
          </p>
          <p className="text-xs text-text-muted">
            {transaction.category} · {formatShortDate(transaction.date)}
          </p>
        </div>
      </div>
      <span
        className={`text-sm font-semibold ${isIncome ? "text-success" : "text-danger"}`}
      >
        {formatCurrency(transaction.amount)}
      </span>
    </div>
  );
}
