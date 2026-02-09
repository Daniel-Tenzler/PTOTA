import type { GameState, Enemy } from '../../types';
import { getRandomEnemy } from '../../data/enemies';
import { PLAYER_ATTACK_INTERVAL, PLAYER_REVIVE_HEALTH_PERCENT } from '../../constants/combat';
import { createLogEntry } from './combatLogger';

/**
 * Combat defeat handling.
 * Manages rewards for defeating enemies and penalties for player defeat.
 */

/**
 * Handles the defeat of an enemy.
 * Grants rewards to the player and immediately spawns a new enemy.
 *
 * @param state - Current game state
 * @param enemy - The defeated enemy
 * @returns Partial game state with rewards applied and new enemy spawned
 */
export function handleEnemyDefeat(state: GameState, enemy: Enemy): Partial<GameState> {
  const updates: Partial<GameState> = {};

  // Grant rewards
  for (const [resource, amount] of Object.entries(enemy.rewards)) {
    updates.resources = {
      ...updates.resources,
      [resource]: (state.resources[resource] || 0) + amount,
    };
  }

  const rewardMessages = Object.entries(enemy.rewards)
    .map(([r, amt]) => `+${amt} ${r}`)
    .join(', ');

  // Immediately spawn new enemy and reset log
  updates.combat = {
    isActive: true,
    currentEnemy: getRandomEnemy(),
    playerAttackTimer: PLAYER_ATTACK_INTERVAL,
    enemyAttackTimer: 0,
    log: [createLogEntry('enemy-defeat', `${enemy.name} defeated! ${rewardMessages}`)],
  };

  return updates;
}

/**
 * Handles the defeat of the player.
 * Deactivates combat and restores the player to a percentage of max health.
 *
 * @param state - Current game state
 * @returns Partial game state with combat stopped and health partially restored
 */
export function handlePlayerDefeat(state: GameState): Partial<GameState> {
  return {
    combat: {
      isActive: false,
      currentEnemy: null,
      playerAttackTimer: PLAYER_ATTACK_INTERVAL,
      enemyAttackTimer: 0,
      log: [],
    },
    specialResources: {
      ...state.specialResources,
      health: {
        ...state.specialResources.health,
        current: state.specialResources.health.max * PLAYER_REVIVE_HEALTH_PERCENT,
      },
    },
  };
}
