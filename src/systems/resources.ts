import type { GameState, SpecialResources } from '../types';

export function updateSpecialResources(state: GameState, delta: number): Partial<GameState> {
  const updates: Partial<GameState> = {};

  // Stamina regen
  const staminaRegen = state.specialResources.stamina.regenRate * delta;
  const newStamina = Math.min(
    state.specialResources.stamina.max,
    state.specialResources.stamina.current + staminaRegen
  );

  // Health regen (only outside combat)
  const healthRegen = state.specialResources.health.regenRate * delta;
  const newHealth = state.combat.isActive
    ? state.specialResources.health.current // No regen during combat
    : Math.min(
        state.specialResources.health.max,
        state.specialResources.health.current + healthRegen
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

  return updates;
}
