import type { GameState, CombatLogEntry } from '../types';
import { spawnEnemy, startCombat, stopCombat } from './combat/combatSpawning';
import { processPlayerAttack, processEnemyAttack } from './combat/combatAttacking';
import { handleEnemyDefeat, handlePlayerDefeat } from './combat/combatDefeat';

/**
 * Main combat system orchestrator.
 * Coordinates combat updates by delegating to specialized modules.
 *
 * This module serves as the entry point for all combat logic,
 * delegating specific responsibilities to focused submodules:
 * - combatSpawning: Enemy spawning and combat lifecycle
 * - combatAttacking: Attack processing for player and enemies
 * - combatDefeat: Victory/defeat handling
 */

/**
 * Merges combat updates from player and enemy attacks.
 * Both attacks may update timers, logs, and other combat state.
 * This function properly merges these updates instead of overwriting.
 *
 * The attack results now return only CHANGED fields (not full combat state),
 * so we start from base state and apply partial updates.
 */
function mergeCombatUpdates(
  state: GameState,
  playerResult: ReturnType<typeof processPlayerAttack>,
  enemyResult: ReturnType<typeof processEnemyAttack>
): Partial<GameState>['combat'] {
  const playerCombat = playerResult.updates.combat;
  const enemyCombat = enemyResult.updates.combat;

  // Start with base combat state
  const baseCombat = state.combat;
  let mergedCombat = { ...baseCombat };

  // Collect all log entries to add
  const logEntriesToAdd: CombatLogEntry[] = [];

  // Apply player combat updates if present
  if (playerCombat) {
    // Extract log entries if any (they're relative to base state)
    if (playerCombat.log) {
      // Find entries that aren't in the base log
      const baseTimestamps = new Set(baseCombat.log.map(e => e.timestamp));
      const newEntries = playerCombat.log.filter(e => !baseTimestamps.has(e.timestamp));
      logEntriesToAdd.push(...newEntries);
    }
    // Apply other updates (without log, we'll merge logs at the end)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { log: _playerLog, ...playerUpdatesWithoutLog } = playerCombat;
    mergedCombat = { ...mergedCombat, ...playerUpdatesWithoutLog };
  }

  // Apply enemy combat updates if present
  if (enemyCombat) {
    // Extract log entries if any (they're relative to base state)
    if (enemyCombat.log) {
      // Find entries that aren't in the base log
      const baseTimestamps = new Set(baseCombat.log.map(e => e.timestamp));
      const newEntries = enemyCombat.log.filter(e => !baseTimestamps.has(e.timestamp));
      logEntriesToAdd.push(...newEntries);
    }
    // Apply other updates (without log, we'll merge logs at the end)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { log: _enemyLog, ...enemyUpdatesWithoutLog } = enemyCombat;
    mergedCombat = { ...mergedCombat, ...enemyUpdatesWithoutLog };
  }

  // Merge logs: base log + all new entries (deduplicated by timestamp)
  if (logEntriesToAdd.length > 0) {
    const seenTimestamps = new Set(mergedCombat.log.map(e => e.timestamp));
    const uniqueNewEntries = logEntriesToAdd.filter(e => !seenTimestamps.has(e.timestamp));
    mergedCombat.log = [...mergedCombat.log, ...uniqueNewEntries];
  }

  return mergedCombat;
}

/**
 * Updates combat state based on elapsed time.
 * Orchestrates the combat loop by coordinating spawning, attacking, and defeat handling.
 *
 * @param state - Current game state
 * @param delta - Time elapsed since last update (in seconds)
 * @returns Partial game state with combat updates applied
 */
export function updateCombat(state: GameState, delta: number): Partial<GameState> {
  // Handle enemy spawning
  const spawnResult = spawnEnemy(state);
  if (spawnResult) {
    return spawnResult;
  }

  // If combat not active or no enemy, do nothing
  if (!state.combat.isActive || !state.combat.currentEnemy) {
    return {};
  }

  const enemy = state.combat.currentEnemy;

  // Check if enemy is already dead (from spell damage)
  if (enemy.health <= 0) {
    return handleEnemyDefeat(state, enemy);
  }

  // Process player attack
  const playerAttackResult = processPlayerAttack(state, delta, enemy);
  if (playerAttackResult.isDefeat) {
    return handleEnemyDefeat(state, enemy);
  }

  // Process enemy attack
  const enemyAttackResult = processEnemyAttack(state, delta, enemy);
  if (enemyAttackResult.isDefeat) {
    return handlePlayerDefeat(state);
  }

  // Properly merge combat updates from both attacks
  const mergedCombat = mergeCombatUpdates(state, playerAttackResult, enemyAttackResult);

  // Build final updates object
  const updates: Partial<GameState> = {
    combat: mergedCombat,
  };

  // Include enemy attack's special resources updates (health damage)
  if (enemyAttackResult.updates.specialResources) {
    updates.specialResources = enemyAttackResult.updates.specialResources;
  }

  return updates;
}

// Re-export combat lifecycle functions for external use
export { startCombat, stopCombat };
