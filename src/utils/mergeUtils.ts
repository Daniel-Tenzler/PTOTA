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
 * Merge strategy for different property types.
 */
type MergeStrategy<T> = (
  accumulator: T | undefined,
  newValue: Partial<T>,
  baseValue: T
) => T;

/**
 * Generic shallow merge for dictionary-like properties.
 */
function mergeShallowProperty<T extends Record<string, unknown>>(
  accumulator: T | undefined,
  newValue: Partial<T>,
  baseValue: T
): T {
  return {
    ...(accumulator || baseValue),
    ...newValue,
  } as T;
}

/**
 * Merge strategy for special resources (deep merge for stamina/health).
 */
const mergeSpecialResourcesProperty: MergeStrategy<GameState['specialResources']> = (
  accumulator,
  newValue,
  baseValue
): GameState['specialResources'] => {
  const acc = accumulator || baseValue;
  return {
    stamina: {
      current: newValue.stamina?.current ?? acc.stamina.current,
      max: newValue.stamina?.max ?? acc.stamina.max,
      regenRate: newValue.stamina?.regenRate ?? acc.stamina.regenRate,
    },
    health: {
      current: newValue.health?.current ?? acc.health.current,
      max: newValue.health?.max ?? acc.health.max,
      regenRate: newValue.health?.regenRate ?? acc.health.regenRate,
    },
  };
};

/**
 * Merge strategy for spells (deep merge for cooldowns).
 */
const mergeSpellsProperty: MergeStrategy<GameState['spells']> = (
  accumulator,
  newValue,
  baseValue
): GameState['spells'] => {
  const acc = accumulator || baseValue;
  return {
    slots: newValue.slots ?? acc.slots,
    equipped: newValue.equipped ?? acc.equipped,
    cooldowns: {
      ...acc.cooldowns,
      ...(newValue.cooldowns || {}),
    },
  };
};

/**
 * Properties that use shallow merge (dictionary-like objects).
 */
const SHALLOW_MERGE_KEYS = [
  'resources',
  'actions',
  'skills',
  'combat',
  'dungeons',
] as const;

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

  for (const key of Object.keys(newUpdates)) {
    const typedKey = key as keyof GameState;
    const newValue = newUpdates[typedKey];

    if (newValue === undefined || newValue === null) continue;

    // Use custom merge strategy if available
    if (typedKey === 'specialResources') {
      result.specialResources = mergeSpecialResourcesProperty(
        result.specialResources,
        newValue as Partial<GameState['specialResources']>,
        baseState.specialResources
      );
    } else if (typedKey === 'spells') {
      result.spells = mergeSpellsProperty(
        result.spells,
        newValue as Partial<GameState['spells']>,
        baseState.spells
      );
    }
    // Use shallow merge for dictionary-like properties
    else if (SHALLOW_MERGE_KEYS.includes(typedKey as any)) { // eslint-disable-line @typescript-eslint/no-explicit-any
      result[typedKey] = mergeShallowProperty(
        result[typedKey] as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        newValue as any, // eslint-disable-line @typescript-eslint/no-explicit-any
        baseState[typedKey] as any // eslint-disable-line @typescript-eslint/no-explicit-any
      );
    }
    // Simple override for scalar values (lastUpdate, activeTab)
    else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (result as any)[typedKey] = newValue;
    }
  }

  return result;
}
