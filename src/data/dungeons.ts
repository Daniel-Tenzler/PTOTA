import type { DungeonDefinition } from '../types';

export const DUNGEON_DEFS: Record<string, DungeonDefinition> = {
  'dark-forest': {
    id: 'dark-forest',
    name: 'Dark Forest',
    description: 'A mysterious forest filled with weak creatures',
    enemies: ['slime', 'goblin'],
    difficulty: 1,
    levelRequirement: 1,
  },
  'forgotten-crypt': {
    id: 'forgotten-crypt',
    name: 'Forgotten Crypt',
    description: 'Ancient tomb with undead horrors',
    enemies: ['skeleton', 'skeleton', 'goblin'],
    difficulty: 2,
    levelRequirement: 3,
  },
};

export function getRandomEnemyFromDungeon(dungeonId: string): string {
  const dungeon = DUNGEON_DEFS[dungeonId];
  if (!dungeon) return 'slime';

  const enemies = dungeon.enemies;
  return enemies[Math.floor(Math.random() * enemies.length)];
}

export function canAccessDungeon(dungeonId: string, arcaneLevel: number): boolean {
  const dungeon = DUNGEON_DEFS[dungeonId];
  if (!dungeon) return false;
  return arcaneLevel >= dungeon.levelRequirement;
}
