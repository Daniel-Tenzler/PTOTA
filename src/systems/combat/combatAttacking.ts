import type { GameState, Enemy } from '../../types';
import { PLAYER_ATTACK_INTERVAL, PLAYER_BASE_DAMAGE } from '../../constants/combat';
import { addLogEntry, createPlayerAttackEntry, createEnemyAttackEntry } from './combatLogger';

/**
 * Combat attack processing.
 * Handles player auto-attacks and enemy attacks during combat.
 */

/**
 * Result of processing an attack.
 * Contains state updates and indicates whether a defeat occurred.
 */
export interface AttackResult {
  updates: Partial<GameState>;
  isDefeat: boolean;
}

/**
 * Calculates the damage dealt by the player per attack.
 * Base damage plus bonuses from skills (e.g., Arcane level).
 *
 * @param state - Current game state
 * @returns Total damage to deal
 */
export function calculatePlayerDamage(state: GameState): number {
  // Base damage + skill bonuses
  let damage = PLAYER_BASE_DAMAGE;
  const arcaneLevel = state.skills.arcane?.level || 1;
  damage += arcaneLevel;
  return damage;
}

/**
 * Processes the player's auto-attack during combat.
 * Updates the attack timer and deals damage when the timer completes.
 *
 * @param state - Current game state
 * @param delta - Time elapsed since last update (in seconds)
 * @param enemy - Current enemy being fought
 * @returns Attack result with state updates and defeat status
 */
export function processPlayerAttack(state: GameState, delta: number, enemy: Enemy): AttackResult {
  const newPlayerTimer = state.combat.playerAttackTimer - delta;

  if (newPlayerTimer <= 0) {
    const playerDamage = calculatePlayerDamage(state);
    const newEnemyHealth = enemy.health - playerDamage;

    // Note: Enemy defeat is handled by the caller (updateCombat)
    // We return isDefeat: true to signal this condition
    if (newEnemyHealth <= 0) {
      return {
        updates: {
          combat: {
            ...state.combat,
            currentEnemy: { ...enemy, health: 0 },
            playerAttackTimer: PLAYER_ATTACK_INTERVAL,
            log: addLogEntry(state.combat.log, createPlayerAttackEntry(playerDamage)),
          },
        },
        isDefeat: true,
      };
    }

    const logEntry = createPlayerAttackEntry(playerDamage);

    return {
      updates: {
        combat: {
          ...state.combat,
          currentEnemy: { ...enemy, health: newEnemyHealth },
          playerAttackTimer: PLAYER_ATTACK_INTERVAL,
          log: addLogEntry(state.combat.log, logEntry),
        },
      },
      isDefeat: false,
    };
  }

  return {
    updates: {
      combat: { ...state.combat, playerAttackTimer: newPlayerTimer },
    },
    isDefeat: false,
  };
}

/**
 * Processes the enemy's attack during combat.
 * Updates the enemy attack timer and deals damage to player when ready.
 *
 * @param state - Current game state
 * @param delta - Time elapsed since last update (in seconds)
 * @param enemy - Current enemy being fought
 * @returns Attack result with state updates and defeat status
 */
export function processEnemyAttack(state: GameState, delta: number, enemy: Enemy): AttackResult {
  const newEnemyTimer = (state.combat.enemyAttackTimer || enemy.attackInterval) - delta;

  if (newEnemyTimer <= 0) {
    const enemyDamage = enemy.damage;
    const newPlayerHealth = state.specialResources.health.current - enemyDamage;

    // Note: Player defeat is handled by the caller (updateCombat)
    // We return isDefeat: true to signal this condition
    if (newPlayerHealth <= 0) {
      return {
        updates: {
          specialResources: {
            ...state.specialResources,
            health: {
              ...state.specialResources.health,
              current: 0,
            },
          },
          combat: {
            ...state.combat,
            enemyAttackTimer: enemy.attackInterval,
            log: addLogEntry(state.combat.log, createEnemyAttackEntry(enemy.name, enemyDamage)),
          },
        },
        isDefeat: true,
      };
    }

    const logEntry = createEnemyAttackEntry(enemy.name, enemyDamage);

    return {
      updates: {
        specialResources: {
          ...state.specialResources,
          health: {
            ...state.specialResources.health,
            current: newPlayerHealth,
          },
        },
        combat: {
          ...state.combat,
          enemyAttackTimer: enemy.attackInterval,
          log: addLogEntry(state.combat.log, logEntry),
        },
      },
      isDefeat: false,
    };
  }

  return {
    updates: {
      combat: {
        ...state.combat,
        enemyAttackTimer: newEnemyTimer,
      },
    },
    isDefeat: false,
  };
}
