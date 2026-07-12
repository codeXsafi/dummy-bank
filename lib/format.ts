/*
 * lib/format.ts — display formatting shared by the dashboard and
 * transactions list, so amounts and dates read identically wherever a
 * transaction is shown.
 */

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

// Dates from the API are plain "YYYY-MM-DD" strings. Parsing them with
// `new Date(iso)` and formatting with `toLocaleDateString` would apply the
// browser's LOCAL timezone to what is really a date-only value, and can
// silently shift the displayed day by one depending on where the user is —
// splitting the string ourselves avoids that entirely.
export function formatShortDate(iso: string): string {
  const [, month, day] = iso.split("-");
  return `${MONTH_LABELS[Number(month) - 1]} ${Number(day)}`;
}

interface FormatCurrencyOptions {
  // Transaction rows want an explicit "+" on income so income/spending are
  // visually symmetric; an account balance reads more naturally without a
  // forced leading "+".
  forceSign?: boolean;
}

export function formatCurrency(
  amount: number,
  { forceSign = true }: FormatCurrencyOptions = {}
): string {
  const sign = amount < 0 ? "-" : forceSign ? "+" : "";
  return `${sign}$${Math.abs(amount).toFixed(2)}`;
}
