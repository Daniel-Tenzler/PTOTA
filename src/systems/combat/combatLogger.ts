import type { CombatLogEntry } from '../../types';
import { MAX_LOG_ENTRIES } from '../../constants/combat';

/**
 * Combat logging utilities.
 * Manages combat log entries with automatic size limiting.
 */

/**
 * Adds a new log entry to the combat log.
 * Keeps only the last MAX_LOG_ENTRIES entries to prevent unbounded growth.
 *
 * @param log - The current combat log
 * @param entry - The new entry to add
 * @returns A new log array with the entry added
 *
 * @example
 * const log = [];
 * const updated = addLogEntry(log, { type: 'player-attack', message: 'You deal 5 damage', timestamp: Date.now() });
 * // updated.length === 1
 */
export function addLogEntry(log: CombatLogEntry[], entry: CombatLogEntry): CombatLogEntry[] {
  return [...log, entry].slice(-MAX_LOG_ENTRIES);
}

/**
 * Creates a new combat log entry.
 *
 * @param type - The type of log entry
 * @param message - The log message
 * @returns A new combat log entry with current timestamp
 *
 * @example
 * const entry = createLogEntry('player-attack', 'You deal 5 damage');
 */
export function createLogEntry(
  type: CombatLogEntry['type'],
  message: string
): CombatLogEntry {
  return {
    type,
    message,
    timestamp: Date.now(),
  };
}

/**
 * Creates a player attack log entry.
 *
 * @param damage - The amount of damage dealt
 * @returns A formatted combat log entry
 */
export function createPlayerAttackEntry(damage: number): CombatLogEntry {
  return createLogEntry('player-attack', `You deal ${damage} damage`);
}

/**
 * Creates an enemy attack log entry.
 *
 * @param enemyName - The name of the enemy
 * @param damage - The amount of damage dealt
 * @returns A formatted combat log entry
 */
export function createEnemyAttackEntry(enemyName: string, damage: number): CombatLogEntry {
  return createLogEntry('enemy-attack', `${enemyName} deals ${damage} damage`);
}

/**
 * Creates an enemy defeat log entry.
 *
 * @param enemyName - The name of the defeated enemy
 * @param rewards - The rewards received (as a formatted string)
 * @returns A formatted combat log entry
 */
export function createEnemyDefeatEntry(enemyName: string, rewards: string): CombatLogEntry {
  return createLogEntry('enemy-defeat', `${enemyName} defeated! ${rewards}`);
}

/**
 * Creates a spell cast log entry.
 *
 * @param spellName - The name of the spell
 * @param damage - The amount of damage dealt
 * @returns A formatted combat log entry
 */
export function createSpellCastEntry(spellName: string, damage: number): CombatLogEntry {
  return createLogEntry('spell-cast', `Cast ${spellName} for ${damage} damage`);
}
