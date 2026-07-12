"use client";

import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { usePageTitle } from "@/lib/usePageTitle";

interface MockCard {
  id: string;
  label: string;
  type: "Debit" | "Credit";
  last4: string;
  fullNumber: string;
}

const MOCK_CARDS: MockCard[] = [
  {
    id: "card-1",
    label: "Dummy Bank Debit",
    type: "Debit",
    last4: "4821",
    fullNumber: "4532 8891 2207 4821",
  },
  {
    id: "card-2",
    label: "Dummy Bank Credit",
    type: "Credit",
    last4: "7790",
    fullNumber: "5412 7734 9903 7790",
  },
];

// Only the Credit tile shows this table — "Credit limit"/"APR" etc. are
// credit-card-specific fields that don't apply to the Debit tile.
const CREDIT_DETAILS = [
  { label: "Credit limit", value: "$12,000.00" },
  { label: "Available credit", value: "$9,840.00" },
  { label: "Current balance", value: "$2,160.00" },
  { label: "Payment due", value: "Jul 25, 2026" },
  { label: "APR", value: "19.99%" },
];

function CardTile({ card }: { card: MockCard }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg bg-linear-to-br from-primary to-accent p-6 text-text-inverse shadow-sm">
        <p className="text-sm opacity-80">{card.type}</p>
        <p className="mt-6 font-mono text-lg font-semibold tracking-widest">
          {revealed ? card.fullNumber : `•••• •••• •••• ${card.last4}`}
        </p>
        <p className="mt-2 text-sm opacity-80">{card.label}</p>
      </div>

      <button
        type="button"
        onClick={() => setRevealed((prev) => !prev)}
        className="flex items-center gap-1.5 self-start text-sm text-accent hover:underline"
      >
        {revealed ? <EyeOff size={14} /> : <Eye size={14} />}
        {revealed ? "Hide" : "Reveal"} full card number
      </button>

      {card.type === "Credit" && (
        <div className="overflow-hidden rounded-lg border border-border">
          {CREDIT_DETAILS.map((detail, index) => (
            <div
              key={detail.label}
              className={`flex items-center justify-between px-4 py-3 text-sm ${
                index % 2 === 1 ? "bg-bg" : "bg-surface"
              }`}
            >
              <span className="text-text-muted">{detail.label}</span>
              <span className="font-medium text-text">{detail.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CardsPage() {
  usePageTitle("Cards");

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {MOCK_CARDS.map((card) => (
          <CardTile key={card.id} card={card} />
        ))}
      </div>
    </div>
  );
}
