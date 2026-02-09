import type { GameState } from '../../types';
import { mergeSpecialResources } from './mergeSpecialResources';
import { mergeSpells } from './mergeSpells';

/**
 * Perform a deep merge of GameState updates.
 * This is the main entry point for merging game state updates.
 *
 * @param base - The base game state
 * @param updates - Partial updates to apply
 * @returns A new merged game state
 */
export function mergeGameState(
  base: GameState,
  updates: Partial<GameState>
): GameState {
  return {
    ...base,
    ...updates,
    resources: updates.resources ? { ...base.resources, ...updates.resources } : base.resources,
    specialResources: mergeSpecialResources(base.specialResources, updates.specialResources),
    actions: updates.actions ? { ...base.actions, ...updates.actions } : base.actions,
    skills: updates.skills ? { ...base.skills, ...updates.skills } : base.skills,
    spells: mergeSpells(base.spells, updates.spells),
    combat: updates.combat ? { ...base.combat, ...updates.combat } : base.combat,
    dungeons: updates.dungeons ? { ...base.dungeons, ...updates.dungeons } : base.dungeons,
  };
}
