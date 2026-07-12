/*
 * lib/transactionTotals.ts — computes total income vs. total spending from
 * a transaction list. Extracted out of IncomeVsSpendingChart.tsx so the
 * dashboard's balance hero card (which shows the same two numbers as small
 * badges) and the chart can never disagree — both call this one function.
 */
import type { Transaction } from "@/app/api/transaction-history/route";

export interface IncomeAndSpending {
  income: number;
  spending: number;
}

export function computeIncomeAndSpending(
  transactions: Transaction[]
): IncomeAndSpending {
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const spending = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return {
    income: Number(income.toFixed(2)),
    spending: Number(spending.toFixed(2)),
  };
}
