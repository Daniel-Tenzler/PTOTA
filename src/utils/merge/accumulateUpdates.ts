import type { GameState } from '../../types';
import { mergeSpecialResourcesProperty } from './mergeSpecialResources';
import { mergeSpellsProperty } from './mergeSpells';

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
 * Generic shallow merge for dictionary-like properties.
 * Used internally by accumulateUpdates.
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
 * Accumulate multiple partial updates into a single update.
 * Useful for collecting updates from multiple systems in the game loop.
 *
 * @param accumulator - The accumulated updates so far
 * @param newUpdates - New updates to add
 * @param baseState - The base state for reference
 * @returns Merged updates
 *
 * @example
 * const base = createInitialState();
 * const update1 = { resources: { gold: 10 } };
 * const update2 = { resources: { scrolls: 5 } };
 * const result = accumulateUpdates(update1, update2, base);
 * // result.resources = { gold: 10, scrolls: 5 }
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
    else if (SHALLOW_MERGE_KEYS.includes(typedKey as typeof SHALLOW_MERGE_KEYS[number])) {
      (result as Record<keyof GameState, unknown>)[typedKey] = mergeShallowProperty(
        result[typedKey] as Record<string, unknown> | undefined,
        newValue as Partial<Record<string, unknown>>,
        baseState[typedKey] as Record<string, unknown>
      );
    }
    // Simple override for scalar values (lastUpdate, activeTab)
    else {
      (result as Record<keyof GameState, unknown>)[typedKey] = newValue;
    }
  }

  return result;
}
