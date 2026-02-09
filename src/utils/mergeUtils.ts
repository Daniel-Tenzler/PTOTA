import type { GameState } from '../types';

/**
 * Deep merge utility for GameState updates.
 * Handles nested object merging with proper null/undefined handling.
 */

/**
 * Merge two objects, with updates taking precedence.
 * For nested objects, performs a shallow merge (one level deep).
 *
 * @param base - The base object
 * @param updates - Partial updates to apply
 * @returns A new merged object
 */
export function mergeShallow<T extends Record<string, unknown>>(base: T, updates: Partial<T>): T {
  if (!updates) return base;
  return { ...base, ...updates };
}

/**
 * Merge a nested object within specialResources (stamina, health).
 *
 * @param base - The base special resource object
 * @param updates - Partial updates to apply
 * @returns A new merged object
 */
export function mergeSpecialResource(
  base: { current: number; max: number; regenRate: number },
  updates?: Partial<{ current: number; max: number; regenRate: number }>
): { current: number; max: number; regenRate: number } {
  if (!updates) return base;
  return { ...base, ...updates };
}

/**
 * Merge specialResources object (contains stamina and health).
 *
 * @param base - The base special resources
 * @param updates - Partial updates to apply
 * @returns A new merged special resources object
 */
export function mergeSpecialResources(
  base: GameState['specialResources'],
  updates?: Partial<GameState['specialResources']>
): GameState['specialResources'] {
  if (!updates) return base;
  return {
    stamina: mergeSpecialResource(base.stamina, updates.stamina),
    health: mergeSpecialResource(base.health, updates.health),
  };
}

/**
 * Merge spells state, handling nested cooldowns object.
 *
 * @param base - The base spells state
 * @param updates - Partial updates to apply
 * @returns A new merged spells object
 */
export function mergeSpells(
  base: GameState['spells'],
  updates?: Partial<GameState['spells']>
): GameState['spells'] {
  if (!updates) return base;
  return {
    ...base,
    ...updates,
    cooldowns: { ...base.cooldowns, ...(updates.cooldowns || {}) },
  };
}

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

/**
 * Accumulate multiple partial updates into a single update.
 * Useful for collecting updates from multiple systems in the game loop.
 *
 * @param accumulator - The accumulated updates so far
 * @param newUpdates - New updates to add
 * @param baseState - The base state for reference
 * @returns Merged updates
 */
export function accumulateUpdates(
  accumulator: Partial<GameState>,
  newUpdates: Partial<GameState>,
  baseState: GameState
): Partial<GameState> {
  const result: Partial<GameState> = { ...accumulator };

  // Merge each top-level property
  for (const key of Object.keys(newUpdates)) {
    const typedKey = key as keyof GameState;

    if (newUpdates[typedKey]) {
      if (typedKey === 'specialResources') {
        result.specialResources = {
          ...(result.specialResources || baseState.specialResources),
          ...newUpdates.specialResources,
        };
      } else if (typedKey === 'spells' && newUpdates.spells) {
        result.spells = {
          ...(result.spells || baseState.spells),
          ...newUpdates.spells,
          cooldowns: {
            ...(result.spells?.cooldowns || baseState.spells.cooldowns),
            ...(newUpdates.spells.cooldowns || {}),
          },
        };
      } else if (typedKey === 'resources') {
        result.resources = {
          ...(result.resources || baseState.resources),
          ...newUpdates.resources,
        };
      } else if (typedKey === 'actions') {
        result.actions = {
          ...(result.actions || baseState.actions),
          ...newUpdates.actions,
        };
      } else if (typedKey === 'skills') {
        result.skills = {
          ...(result.skills || baseState.skills),
          ...newUpdates.skills,
        };
      } else if (typedKey === 'combat') {
        result.combat = {
          ...(result.combat || baseState.combat),
          ...newUpdates.combat,
        };
      } else if (typedKey === 'dungeons') {
        result.dungeons = {
          ...(result.dungeons || baseState.dungeons),
          ...newUpdates.dungeons,
        };
      } else if (typedKey === 'lastUpdate') {
        // lastUpdate just gets overwritten
        result.lastUpdate = newUpdates.lastUpdate;
      } else if (typedKey === 'activeTab') {
        // activeTab just gets overwritten
        result.activeTab = newUpdates.activeTab;
      }
    }
  }

  return result;
}
