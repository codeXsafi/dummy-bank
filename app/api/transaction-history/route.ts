import { NextResponse } from "next/server";

export interface Transaction {
  id: string;
  merchant: string;
  amount: number; // positive = income, negative = spending
  category: string;
  date: string;
}

const TRANSACTIONS: Transaction[] = [
  {
    id: "txn-1",
    merchant: "Whole Foods Market",
    amount: -84.32,
    category: "Groceries",
    date: "2026-07-07",
  },
  {
    id: "txn-2",
    merchant: "Netflix",
    amount: -15.99,
    category: "Entertainment",
    date: "2026-07-06",
  },
  {
    id: "txn-3",
    merchant: "Acme Corp — Payroll",
    amount: 4250.0,
    category: "Income",
    date: "2026-07-05",
  },
  {
    id: "txn-4",
    merchant: "Shell Gas Station",
    amount: -67.14,
    category: "Transport",
    date: "2026-07-04",
  },
  {
    id: "txn-5",
    merchant: "Amazon Prime Order",
    amount: -139.99,
    category: "Shopping",
    date: "2026-07-03",
  },
  {
    id: "txn-6",
    merchant: "Blue Bottle Coffee",
    amount: -8.5,
    category: "Dining",
    date: "2026-07-03",
  },
  {
    id: "txn-7",
    merchant: "Transfer from Savings",
    amount: 500.0,
    category: "Transfer",
    date: "2026-07-02",
  },
  {
    id: "txn-8",
    merchant: "LA Fitness",
    amount: -49.99,
    category: "Health",
    date: "2026-07-01",
  },
  {
    id: "txn-9",
    merchant: "Spotify Premium",
    amount: -10.99,
    category: "Entertainment",
    date: "2026-06-30",
  },
  {
    id: "txn-10",
    merchant: "Con Edison Utilities",
    amount: -124.5,
    category: "Bills",
    date: "2026-06-29",
  },
];

export async function GET() {
  return NextResponse.json(TRANSACTIONS);
}
