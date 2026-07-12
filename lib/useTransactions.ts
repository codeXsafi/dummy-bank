/*
 * lib/useTransactions.ts — fetches GET /api/transaction-history once and
 * hands the result to whichever page needs it (dashboard, transactions).
 * The mock backend has no filtering/search endpoint, so both pages fetch
 * the same full list and do their own client-side slicing/filtering.
 */
"use client";

import { useEffect, useState } from "react";
import type { Transaction } from "@/app/api/transaction-history/route";

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Guards against setting state after unmount if the request resolves
    // late (e.g. the user navigates away from the dashboard quickly).
    let cancelled = false;

    fetch("/api/transaction-history")
      .then((res) => res.json())
      .then((data: Transaction[]) => {
        if (!cancelled) setTransactions(data);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { transactions, isLoading };
}
