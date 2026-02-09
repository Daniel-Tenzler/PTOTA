// No type imports needed for this module

/**
 * Merge two objects, with updates taking precedence.
 * For nested objects, performs a shallow merge (one level deep).
 *
 * @param base - The base object
 * @param updates - Partial updates to apply
 * @returns A new merged object
 *
 * @example
 * const base = { a: 1, b: 2 };
 * const updates = { b: 3, c: 4 };
 * mergeShallow(base, updates); // { a: 1, b: 3, c: 4 }
 */
export function mergeShallow<T extends Record<string, unknown>>(
  base: T,
  updates: Partial<T>
): T {
  if (!updates) return base;
  return { ...base, ...updates };
}
