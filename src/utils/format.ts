/**
 * Format number to remove trailing zeros after decimal point.
 * Rounds to 2 decimal places to avoid floating point precision issues.
 *
 * @param value - The number to format
 * @returns The formatted number as a string
 *
 * @example
 * formatNum(5)           // "5"
 * formatNum(5.0)         // "5"
 * formatNum(5.10)        // "5.1"
 * formatNum(5.12345)     // "5.12"
 * formatNum(5.127)       // "5.13"
 */
export function formatNum(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? rounded.toString() : rounded.toString();
}
