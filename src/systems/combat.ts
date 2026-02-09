import type { GameState, Enemy } from '../types';
import { getRandomEnemy } from '../data/enemies';
import { PLAYER_ATTACK_INTERVAL, PLAYER_BASE_DAMAGE, PLAYER_REVIVE_HEALTH_PERCENT } from '../constants/combat';
import { addLogEntry, createPlayerAttackEntry, createEnemyAttackEntry, createLogEntry } from './combat/combatLogger';

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
    return playerAttackResult.updates;
  }
  Object.assign(updates, playerAttackResult.updates);

  // Process enemy attack
  const enemyAttackResult = processEnemyAttack(state, delta, enemy);
  if (enemyAttackResult.isDefeat) {
    return enemyAttackResult.updates;
  }
  Object.assign(updates, enemyAttackResult.updates);

  return updates;
}

function spawnEnemy(state: GameState): Partial<GameState> | null {
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

interface AttackResult {
  updates: Partial<GameState>;
  isDefeat: boolean;
}

function processPlayerAttack(state: GameState, delta: number, enemy: Enemy): AttackResult {
  const newPlayerTimer = state.combat.playerAttackTimer - delta;

  if (newPlayerTimer <= 0) {
    const playerDamage = calculatePlayerDamage(state);
    const newEnemyHealth = enemy.health - playerDamage;

    if (newEnemyHealth <= 0) {
      return {
        updates: handleEnemyDefeat(state, enemy),
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

function processEnemyAttack(state: GameState, delta: number, enemy: Enemy): AttackResult {
  const newEnemyTimer = (state.combat.enemyAttackTimer || enemy.attackInterval) - delta;

  if (newEnemyTimer <= 0) {
    const enemyDamage = enemy.damage;
    const newPlayerHealth = state.specialResources.health.current - enemyDamage;

    if (newPlayerHealth <= 0) {
      return {
        updates: handlePlayerDefeat(state),
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

function calculatePlayerDamage(state: GameState): number {
  // Base damage + skill bonuses
  let damage = PLAYER_BASE_DAMAGE;
  const arcaneLevel = state.skills.arcane?.level || 1;
  damage += arcaneLevel;
  return damage;
}

function handleEnemyDefeat(state: GameState, enemy: Enemy): Partial<GameState> {
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

function handlePlayerDefeat(state: GameState): Partial<GameState> {
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
