import type { GameState, Enemy, CombatLogEntry, CombatState, SpecialResources } from '../../types';
import { PLAYER_ATTACK_INTERVAL, PLAYER_BASE_DAMAGE } from '../../constants/combat';
import { addLogEntry, createPlayerAttackEntry, createEnemyAttackEntry } from './combatLogger';
import { getHousingBonuses } from '../housing';
import { HOUSING_ITEM_DEFS } from '../../data/housing';

/**
 * Result of processing an attack.
 * Contains state updates and indicates whether a defeat occurred.
 */
export interface AttackResult {
  updates: Partial<GameState>;
  isDefeat: boolean;
}

/**
 * Helper to cast partial combat updates to expected type.
 * The caller (mergeCombatUpdates) will merge with base state,
 * so returning partial updates is safe.
 */
function asCombatUpdate(updates: Partial<CombatState>): Partial<GameState>['combat'] {
  return updates as Partial<GameState>['combat'];
}

/**
 * Helper to cast partial special resources updates to expected type.
 * The merge functions in accumulateUpdates handle partial updates properly.
 */
function asSpecialResourcesUpdate(updates: Partial<SpecialResources>): Partial<GameState>['specialResources'] {
  return updates as Partial<GameState>['specialResources'];
}

/**
 * Configuration for processing a timed attack.
 * Encapsulates the differences between player and enemy attacks.
 */
interface AttackConfig {
  /** Current timer value */
  currentTimer: number;
  /** Timer interval (reset value after attack) */
  timerInterval: number;
  /** Timer key in combat state (e.g., 'playerAttackTimer' or 'enemyAttackTimer') */
  timerKey: keyof GameState['combat'];
  /** Damage to deal */
  damage: number;
  /** Log entry for the attack */
  logEntry: CombatLogEntry;
  /** Combat state updates after the attack (excluding timer) */
  combatUpdates: Omit<Partial<GameState['combat']>, 'playerAttackTimer' | 'enemyAttackTimer'>;
  /** Optional special resources updates (e.g., player health damage) */
  specialResourcesUpdates?: Partial<GameState['specialResources']>;
  /** Whether the attack resulted in a defeat */
  isDefeat: boolean;
}

/**
 * Processes a timed attack using a common pattern.
 * Handles timer decrement, attack execution, and defeat detection.
 *
 * @param state - Current game state (used for log access)
 * @param delta - Time elapsed since last update (in seconds)
 * @param config - Attack configuration
 * @returns Attack result with state updates and defeat status
 * NOTE: Returns only CHANGED fields, not full combat state.
 * The caller is responsible for merging with base state.
 */
function processTimedAttack(
  state: GameState,
  delta: number,
  config: AttackConfig
): AttackResult {
  const newTimer = config.currentTimer - delta;

  if (newTimer <= 0) {
    // Attack executed - return updates with timer reset and log
    const combatUpdates: Partial<CombatState> = {
      ...config.combatUpdates,
      [config.timerKey]: config.timerInterval,
      log: addLogEntry(state.combat.log, config.logEntry),
    };

    if (config.isDefeat) {
      return {
        updates: {
          specialResources: config.specialResourcesUpdates
            ? asSpecialResourcesUpdate(config.specialResourcesUpdates)
            : undefined,
          combat: asCombatUpdate(combatUpdates),
        },
        isDefeat: true,
      };
    }

    return {
      updates: {
        specialResources: config.specialResourcesUpdates
          ? asSpecialResourcesUpdate(config.specialResourcesUpdates)
          : undefined,
        combat: asCombatUpdate(combatUpdates),
      },
      isDefeat: false,
    };
  }

  // Timer not ready - just return timer update (no spread of state.combat!)
  return {
    updates: {
      combat: asCombatUpdate({
        [config.timerKey]: newTimer,
      }),
    },
    isDefeat: false,
  };
}

/**
 * Calculates the damage dealt by the player per attack.
 * Base damage plus bonuses from skills (e.g., Arcane level)
 * and housing combat damage bonuses.
 *
 * @param state - Current game state
 * @returns Total damage to deal
 */
export function calculatePlayerDamage(state: GameState): number {
  // Base damage + skill bonuses
  let damage = PLAYER_BASE_DAMAGE;
  const arcaneLevel = state.skills.arcane?.level || 1;
  damage += arcaneLevel;

  // Add housing combat damage bonus
  const housingBonuses = getHousingBonuses(state, (id) => HOUSING_ITEM_DEFS[id]);
  damage += housingBonuses.combatDamage;

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
  const playerDamage = calculatePlayerDamage(state);
  const newEnemyHealth = enemy.health - playerDamage;
  const isDefeat = newEnemyHealth <= 0;

  const config: AttackConfig = {
    currentTimer: state.combat.playerAttackTimer,
    timerInterval: PLAYER_ATTACK_INTERVAL,
    timerKey: 'playerAttackTimer',
    damage: playerDamage,
    logEntry: createPlayerAttackEntry(playerDamage),
    combatUpdates: {
      currentEnemy: { ...enemy, health: isDefeat ? 0 : newEnemyHealth },
    },
    isDefeat,
  };

  return processTimedAttack(state, delta, config);
}

/**
 * Processes an enemy's attack during combat.
 * Updates the enemy attack timer and deals damage to player when ready.
 *
 * @param state - Current game state
 * @param delta - Time elapsed since last update (in seconds)
 * @param enemy - Current enemy being fought
 * @returns Attack result with state updates and defeat status
 */
export function processEnemyAttack(state: GameState, delta: number, enemy: Enemy): AttackResult {
  const enemyDamage = enemy.damage;
  const newPlayerHealth = state.specialResources.health.current - enemyDamage;
  const isDefeat = newPlayerHealth <= 0;

  const config: AttackConfig = {
    currentTimer: state.combat.enemyAttackTimer || enemy.attackInterval,
    timerInterval: enemy.attackInterval,
    timerKey: 'enemyAttackTimer',
    damage: enemyDamage,
    logEntry: createEnemyAttackEntry(enemy.name, enemyDamage),
    combatUpdates: {},
    specialResourcesUpdates: {
      health: {
        ...state.specialResources.health,
        current: isDefeat ? 0 : newPlayerHealth,
      },
    },
    isDefeat,
  };

  return processTimedAttack(state, delta, config);
}
