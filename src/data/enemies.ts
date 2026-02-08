import type { Enemy } from '../types';
import { getRandomEnemyFromDungeon } from './dungeons';

export const ENEMY_DEFS: Record<string, Omit<Enemy, 'health'>> = {
  'slime': {
    id: 'slime',
    name: 'Slime',
    maxHealth: 20,
    damage: 3,
    attackInterval: 2,
    rewards: { gold: 5, scrolls: 1 },
  },
  'goblin': {
    id: 'goblin',
    name: 'Goblin',
    maxHealth: 35,
    damage: 5,
    attackInterval: 1.5,
    rewards: { gold: 10, scrolls: 2 },
  },
  'skeleton': {
    id: 'skeleton',
    name: 'Skeleton',
    maxHealth: 50,
    damage: 8,
    attackInterval: 2.5,
    rewards: { gold: 15, scrolls: 3, 'enchanted scrolls': 1 },
  },
};

export function spawnEnemy(enemyId: string): Enemy {
  const def = ENEMY_DEFS[enemyId];
  return {
    ...def,
    health: def.maxHealth,
  };
}

export function getRandomEnemy(): Enemy {
  const ids = Object.keys(ENEMY_DEFS);
  const randomId = ids[Math.floor(Math.random() * ids.length)];
  return spawnEnemy(randomId);
}

export function spawnEnemyFromDungeon(dungeonId: string): Enemy {
  const enemyId = getRandomEnemyFromDungeon(dungeonId);
  return spawnEnemy(enemyId);
}
