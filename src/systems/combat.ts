import type { GameState, Enemy, CombatLogEntry } from '../types';
import { getRandomEnemy } from '../data/enemies';

const PLAYER_ATTACK_INTERVAL = 2.5;

export function addLogEntry(log: CombatLogEntry[], entry: CombatLogEntry): CombatLogEntry[] {
  return [...log, entry].slice(-20); // Keep only last 20 entries
}

export function updateCombat(state: GameState, delta: number): Partial<GameState> {
  const updates: Partial<GameState> = {};

  // If combat is active but no enemy, spawn one
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

  // If combat not active or no enemy, do nothing
  if (!state.combat.isActive || !state.combat.currentEnemy) {
    return {};
  }

  const enemy = state.combat.currentEnemy;

  // Check if enemy is already dead (from spell damage)
  if (enemy.health <= 0) {
    return handleEnemyDefeat(state, enemy);
  }

  // Player auto-attack
  const newPlayerTimer = state.combat.playerAttackTimer - delta;
  if (newPlayerTimer <= 0) {
    const playerDamage = calculatePlayerDamage(state);
    const newEnemyHealth = enemy.health - playerDamage;

    if (newEnemyHealth <= 0) {
      return handleEnemyDefeat(state, enemy);
    }

    const logEntry: CombatLogEntry = {
      type: 'player-attack',
      message: `You deal ${playerDamage} damage`,
      timestamp: Date.now(),
    };

    updates.combat = {
      ...state.combat,
      currentEnemy: { ...enemy, health: newEnemyHealth },
      playerAttackTimer: PLAYER_ATTACK_INTERVAL,
      log: addLogEntry(state.combat.log, logEntry),
    };
  } else {
    updates.combat = { ...state.combat, playerAttackTimer: newPlayerTimer };
  }

  // Enemy attack
  const newEnemyTimer = (state.combat.enemyAttackTimer || enemy.attackInterval) - delta;
  if (newEnemyTimer <= 0) {
    const enemyDamage = enemy.damage;
    const newPlayerHealth = state.specialResources.health.current - enemyDamage;

    if (newPlayerHealth <= 0) {
      return handlePlayerDefeat(state);
    }

    const logEntry: CombatLogEntry = {
      type: 'enemy-attack',
      message: `${enemy.name} deals ${enemyDamage} damage`,
      timestamp: Date.now(),
    };

    updates.specialResources = {
      ...state.specialResources,
      health: {
        ...state.specialResources.health,
        current: newPlayerHealth,
      },
    };
    updates.combat = {
      ...updates.combat,
      enemyAttackTimer: enemy.attackInterval,
      log: addLogEntry(state.combat.log, logEntry),
    };
  } else {
    updates.combat = {
      ...updates.combat,
      enemyAttackTimer: newEnemyTimer,
    };
  }

  return updates;
}

function calculatePlayerDamage(state: GameState): number {
  // Base damage + skill bonuses
  let damage = 5;
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
    log: [{
      type: 'enemy-defeat',
      message: `${enemy.name} defeated! ${rewardMessages}`,
      timestamp: Date.now(),
    }],
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
        current: state.specialResources.health.max * 0.5, // Revive with 50% health
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
