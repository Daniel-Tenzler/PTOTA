import type { GameState, SpecialResources, Resources } from '../types';

/**
 * Immutable update utilities for game state.
 * Provides type-safe functions to update nested state without mutation.
 */

/**
 * Updates housing equipped items for a specific house.
 * Returns a partial GameState with the updated housing state.
 */
export function updateHousingEquippedItems(
  state: GameState,
  houseId: string,
  items: string[]
): Partial<GameState> {
  return {
    housing: {
      ...state.housing,
      equippedItems: {
        ...state.housing.equippedItems,
        [houseId]: items,
      },
    },
  };
}

/**
 * Updates housing item location reverse lookup.
 * Returns a partial GameState with the updated housing state.
 */
export function updateHousingItemLocation(
  state: GameState,
  itemLocation: Record<string, string>
): Partial<GameState> {
  return {
    housing: {
      ...state.housing,
      itemLocation: {
        ...state.housing.itemLocation,
        ...itemLocation,
      },
    },
  };
}

/**
 * Removes an item from the item location lookup.
 * Returns a partial GameState with the updated housing state.
 */
export function removeHousingItemLocation(
  state: GameState,
  itemId: string
): Partial<GameState> {
  const newItemLocation = { ...state.housing.itemLocation };
  delete newItemLocation[itemId];

  return {
    housing: {
      ...state.housing,
      itemLocation: newItemLocation,
    },
  };
}

/**
 * Updates special resources (stamina or health).
 * Returns a partial GameState with the updated special resources.
 */
export function updateSpecialResources(
  state: GameState,
  updates: Partial<SpecialResources>
): Partial<GameState> {
  return {
    specialResources: {
      ...state.specialResources,
      ...updates,
    },
  };
}

/**
 * Updates a specific resource value.
 * Returns a partial GameState with the updated resources.
 */
export function updateResource(
  state: GameState,
  resourceId: string,
  value: number
): Partial<GameState> {
  return {
    resources: {
      ...state.resources,
      [resourceId]: value,
    },
  };
}

/**
 * Updates multiple resources at once.
 * Returns a partial GameState with the updated resources.
 * Filters out undefined values from updates to maintain type safety.
 */
export function updateResources(
  state: GameState,
  updates: Partial<Resources>
): Partial<GameState> {
  // Filter out undefined values to maintain Resources type constraint
  const definedUpdates: Record<string, number> = {};
  for (const [key, value] of Object.entries(updates)) {
    if (value !== undefined) {
      definedUpdates[key] = value;
    }
  }

  return {
    resources: {
      ...state.resources,
      ...definedUpdates,
    },
  };
}

/**
 * Combines multiple partial GameState updates into one.
 * Later updates override earlier ones for the same paths.
 */
export function mergeUpdates(...updates: Partial<GameState>[]): Partial<GameState> {
  return Object.assign({}, ...updates);
}
