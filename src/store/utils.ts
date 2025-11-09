// src/store/utils.ts
export function cents(value: number | undefined | null) {
  if (!value) return "₱0.00";
  return `₱${(value / 100).toFixed(2)}`;
}
