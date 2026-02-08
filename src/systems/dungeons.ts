import type { GameState } from '../types';
import { DUNGEON_DEFS, canAccessDungeon } from '../data/dungeons';

export function getAvailableDungeons(state: GameState): typeof DUNGEON_DEFS {
  const available: typeof DUNGEON_DEFS = {};
  const arcaneLevel = state.skills.arcane?.level || 1;

  for (const [id, dungeon] of Object.entries(DUNGEON_DEFS)) {
    if (canAccessDungeon(id, arcaneLevel)) {
      available[id] = dungeon;
    }
  }

  return available;
}

export function unlockDungeon(state: GameState, dungeonId: string): Partial<GameState> {
  if (state.dungeons.unlocked.includes(dungeonId)) return {};

  return {
    dungeons: {
      ...state.dungeons,
      unlocked: [...state.dungeons.unlocked, dungeonId],
    },
  };
}
