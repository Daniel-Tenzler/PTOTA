import type { GameState } from '../../types';
import { getRandomEnemy } from '../../data/enemies';
import { PLAYER_ATTACK_INTERVAL } from '../../constants/combat';

/**
 * Combat spawning and lifecycle management.
 * Handles enemy spawning during combat and starting/stopping combat.
 */

/**
 * Spawns a new enemy if combat is active but no enemy is present.
 * Called during the combat update loop to ensure continuous combat.
 *
 * @param state - Current game state
 * @returns Partial game state updates if enemy spawned, null otherwise
 */
export function spawnEnemy(state: GameState): Partial<GameState> | null {
  if (state.combat.isActive && !state.combat.currentEnemy) {
    return {
      combat: {
        isActive: true,
        currentEnemy: getRandomEnemy(),
        playerAttackTimer: PLAYER_ATTACK_INTERVAL,
        enemyAttackTimer: 0,
        log: [],
      },
    };
  }
  return null;
}

/**
 * Starts combat by spawning a new enemy and initializing combat state.
 * Resets timers and clears any previous combat log.
 *
 * @param _state - Current game state (unused but kept for consistent interface)
 * @returns Partial game state with combat initialized
 */
export function startCombat(_state: GameState): Partial<GameState> {
  return {
    combat: {
      isActive: true,
      currentEnemy: getRandomEnemy(),
      playerAttackTimer: PLAYER_ATTACK_INTERVAL,
      enemyAttackTimer: 0,
      log: [],
    },
  };
}

/**
 * Stops combat and clears all combat-related state.
 * Removes the current enemy and resets timers.
 *
 * @param _state - Current game state (unused but kept for consistent interface)
 * @returns Partial game state with combat deactivated
 */
export function stopCombat(_state: GameState): Partial<GameState> {
  return {
    combat: {
      isActive: false,
      currentEnemy: null,
      playerAttackTimer: PLAYER_ATTACK_INTERVAL,
      enemyAttackTimer: 0,
      log: [],
    },
  };
}
