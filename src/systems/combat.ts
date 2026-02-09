import type { GameState } from '../types';
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

  const updates: Partial<GameState> = {};

  // Process player attack
  const playerAttackResult = processPlayerAttack(state, delta, enemy);
  if (playerAttackResult.isDefeat) {
    return handleEnemyDefeat(state, enemy);
  }
  Object.assign(updates, playerAttackResult.updates);

  // Process enemy attack
  const enemyAttackResult = processEnemyAttack(state, delta, enemy);
  if (enemyAttackResult.isDefeat) {
    return handlePlayerDefeat(state);
  }
  Object.assign(updates, enemyAttackResult.updates);

  return updates;
}

// Re-export combat lifecycle functions for external use
export { startCombat, stopCombat };
