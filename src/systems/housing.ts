/**
 * Housing system logic.
 * Pure functions for calculating housing bonuses, space usage, and affordability.
 */

import type {
  GameState,
  HousingBonuses,
  HouseDefinition,
  HousingItemDefinition,
} from '../types';
import { canAfford } from './resources';
import { parseEffectValue } from '../utils/housingEffects';

/**
 * Calculates the total space capacity of a house.
 * @param houseId - The ID of the house
 * @returns The space capacity of the house
 */
export function getTotalSpace(_houseId: string, house: HouseDefinition): number {
  return house.space;
}

/**
 * Calculates the space used in a specific house by equipped items.
 * @param state - The current game state
 * @param houseId - The ID of the house
 * @returns The total space used in the house
 */
export function getSpaceUsed(state: GameState, houseId: string, getItemDef: (itemId: string) => HousingItemDefinition): number {
  const equippedItems = state.housing.equippedItems[houseId] || [];
  return equippedItems.reduce((total, itemId) => {
    const item = getItemDef(itemId);
    if (!item) return total;
    return total + item.space;
  }, 0);
}

/**
 * Checks if the player can afford to purchase a house.
 * @param state - The current game state
 * @param house - The house definition to check affordability for
 * @returns True if the player can afford the house
 */
export function canAffordHouse(state: GameState, house: HouseDefinition): boolean {
  return canAfford(state, house.cost);
}

/**
 * Checks if the player can afford to purchase a housing item.
 * @param state - The current game state
 * @param item - The housing item definition to check affordability for
 * @returns True if the player can afford the item
 */
export function canAffordItem(state: GameState, item: HousingItemDefinition): boolean {
  return canAfford(state, item.cost);
}

/**
 * Aggregates all housing bonuses from equipped items across all owned houses.
 * Bonuses are summed per-effect-type.
 * @param state - The current game state
 * @param getItemDef - Function to retrieve item definitions by ID
 * @returns The total housing bonuses
 */
export function getHousingBonuses(
  state: GameState,
  getItemDef: (itemId: string) => HousingItemDefinition
): HousingBonuses {
  // Initialize bonuses with default values
  const bonuses: HousingBonuses = {
    skillCap: {},
    passiveGen: {},
    actionBonus: {},
    combatDamage: 0,
    healthRegen: 0,
    spellCooldown: 0,
  };

  // Iterate through all owned houses
  for (const houseId of state.housing.ownedHouses) {
    const equippedItems = state.housing.equippedItems[houseId] || [];

    // Iterate through all equipped items in this house
    for (const itemId of equippedItems) {
      const item = getItemDef(itemId);
      if (!item) continue;

      // Apply bonuses based on effect type
      switch (item.effect) {
        case 'skillCap': {
          const { skillId, amount } = parseEffectValue(item.value);
          const targetKey = skillId || 'all';
          bonuses.skillCap[targetKey] = (bonuses.skillCap[targetKey] || 0) + amount;
          break;
        }

        case 'passiveGen': {
          const { skillId: resourceId, amount } = parseEffectValue(item.value);
          if (resourceId) {
            bonuses.passiveGen[resourceId] = (bonuses.passiveGen[resourceId] || 0) + amount;
          }
          break;
        }

        case 'actionBonus': {
          const { skillId, amount } = parseEffectValue(item.value);
          const targetKey = skillId || 'all';
          bonuses.actionBonus[targetKey] = (bonuses.actionBonus[targetKey] || 0) + amount;
          break;
        }

        case 'combatDamage':
          bonuses.combatDamage += typeof item.value === 'number' ? item.value : 0;
          break;

        case 'healthRegen':
          bonuses.healthRegen += typeof item.value === 'number' ? item.value : 0;
          break;

        case 'spellCooldown':
          bonuses.spellCooldown += typeof item.value === 'number' ? item.value : 0;
          break;
      }
    }
  }

  return bonuses;
}
