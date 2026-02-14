import type { GameState, SpecialResources } from '../types';
import { getHousingBonuses } from './housing';
import { HOUSING_ITEM_DEFS } from '../data/housing';

/**
 * Deducts resource costs from the game state.
 * Handles both standard resources and special resources (stamina, health).
 *
 * IMPORTANT: Caller should verify affordability via canAfford() first.
 * This function does not validate sufficient balances before deducting.
 *
 * @param state - Current game state
 * @param cost - Cost object mapping resource IDs to amounts
 * @returns Partial state updates with deducted costs
 */
export function deductCost(state: GameState, cost: Record<string, number>): Partial<GameState> {
  const newResources = { ...state.resources };
  const newSpecialResources = { ...state.specialResources };

  for (const [resourceId, amount] of Object.entries(cost)) {
    if (resourceId in newResources) {
      newResources[resourceId] -= amount;
    } else if (resourceId === 'stamina') {
      newSpecialResources.stamina.current -= amount;
    } else if (resourceId === 'health') {
      newSpecialResources.health.current -= amount;
    }
  }

  return {
    resources: newResources,
    specialResources: newSpecialResources,
  };
}

/**
 * Checks if the player can afford a cost.
 *
 * @param state - Current game state
 * @param cost - Cost object mapping resource IDs to amounts
 * @returns True if all costs can be paid
 */
export function canAfford(state: GameState, cost: Record<string, number>): boolean {
  for (const [resourceId, amount] of Object.entries(cost)) {
    if (resourceId in state.resources) {
      // Use type-safe access via keyof
      const resourceKey = resourceId as keyof typeof state.resources;
      if (state.resources[resourceKey] < amount) {
        return false;
      }
    } else if (resourceId === 'stamina') {
      if (state.specialResources.stamina.current < amount) {
        return false;
      }
    } else if (resourceId === 'health') {
      if (state.specialResources.health.current < amount) {
        return false;
      }
    }
  }
  return true;
}

export function updateSpecialResources(state: GameState, delta: number): Partial<GameState> {
  const updates: Partial<GameState> = {};

  // Get housing bonuses
  const housingBonuses = getHousingBonuses(state, (id) => HOUSING_ITEM_DEFS[id]);

  // Stamina regen
  const staminaRegen = state.specialResources.stamina.regenRate * delta;
  const newStamina = Math.min(
    state.specialResources.stamina.max,
    state.specialResources.stamina.current + staminaRegen
  );

  // Health regen (only outside combat) - includes base regen + housing bonus
  const baseHealthRegen = state.specialResources.health.regenRate * delta;
  const housingHealthRegen = housingBonuses.healthRegen * delta;
  const totalHealthRegen = baseHealthRegen + housingHealthRegen;

  const newHealth = state.combat.isActive
    ? state.specialResources.health.current // No regen during combat
    : Math.min(
        state.specialResources.health.max,
        state.specialResources.health.current + totalHealthRegen
      );

  updates.specialResources = {
    stamina: {
      ...state.specialResources.stamina,
      current: newStamina,
    },
    health: {
      ...state.specialResources.health,
      current: newHealth,
    },
  } as SpecialResources;

  // Apply housing passive generation
  updates.resources = {};
  for (const [resourceId, amount] of Object.entries(housingBonuses.passiveGen)) {
    updates.resources[resourceId] = (state.resources[resourceId] || 0) + (amount * delta);
  }

  return updates;
}
