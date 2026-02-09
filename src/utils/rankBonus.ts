/**
 * Rank bonus utility functions for game actions.
 * Provides factory functions to create rank bonus calculators.
 */

/**
 * A rank bonus function that calculates bonus percentage based on execution count.
 */
export type RankBonusFunction = (executions: number) => number;

/**
 * Configuration for a rank bonus threshold.
 */
export interface RankBonusThreshold {
  /** Minimum number of executions required for this bonus */
  executions: number;
  /** Bonus multiplier (e.g., 0.2 = +20% effectiveness) */
  bonus: number;
}

/**
 * Creates a rank bonus function from an array of thresholds.
 * The thresholds are checked in descending order of executions,
 * so the first matching threshold is used.
 *
 * @param thresholds - Array of threshold configurations
 * @returns A function that calculates bonus based on execution count
 *
 * @example
 * // Standard rank bonus: 10% at 10 executions, 20% at 100 executions
 * const standardBonus = createRankBonus([
 *   { executions: 100, bonus: 0.2 },
 *   { executions: 10, bonus: 0.1 },
 * ]);
 *
 * standardBonus(5)   // 0
 * standardBonus(10)  // 0.1
 * standardBonus(50)  // 0.1
 * standardBonus(100) // 0.2
 */
export function createRankBonus(thresholds: RankBonusThreshold[]): RankBonusFunction {
  // Sort thresholds by executions in descending order
  const sortedThresholds = [...thresholds].sort((a, b) => b.executions - a.executions);

  return (executions: number): number => {
    for (const threshold of sortedThresholds) {
      if (executions >= threshold.executions) {
        return threshold.bonus;
      }
    }
    return 0;
  };
}

/**
 * Standard rank bonus for most actions.
 * - 10 executions → +10% effectiveness
 * - 100 executions → +20% effectiveness
 */
export const standardRankBonus = createRankBonus([
  { executions: 100, bonus: 0.2 },
  { executions: 10, bonus: 0.1 },
]);

/**
 * Rank bonus for timed/continuous actions.
 * - 10 executions → +5% effectiveness
 * - 50 executions → +15% effectiveness
 */
export const timedRankBonus = createRankBonus([
  { executions: 50, bonus: 0.15 },
  { executions: 10, bonus: 0.05 },
]);

/**
 * Creates a custom rank bonus with a single threshold.
 *
 * @param executions - Number of executions required
 * @param bonus - Bonus multiplier
 * @returns A rank bonus function
 */
export function createSingleThresholdBonus(executions: number, bonus: number): RankBonusFunction {
  return (actualExecutions: number) => (actualExecutions >= executions ? bonus : 0);
}

/**
 * No rank bonus (always returns 0).
 * Useful for actions that should not have rank bonuses.
 */
export const noRankBonus: RankBonusFunction = () => 0;
