import type { GameState, SpecialResources } from '../types';
import { getHousingBonuses } from './housing';
import { HOUSING_ITEM_DEFS } from '../data/housing';

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
