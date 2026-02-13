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
  for (const [resourceId, cost] of Object.entries(house.cost)) {
    // Check standard resources
    if (resourceId in state.resources) {
      if ((state.resources as Record<string, number>)[resourceId] < cost) {
        return false;
      }
    }
    // Check special resources (excluding stamina and health which use nested structure)
    else if (resourceId === 'stamina') {
      if (state.specialResources.stamina.current < cost) {
        return false;
      }
    } else if (resourceId === 'health') {
      if (state.specialResources.health.current < cost) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Checks if the player can afford to purchase a housing item.
 * @param state - The current game state
 * @param item - The housing item definition to check affordability for
 * @returns True if the player can afford the item
 */
export function canAffordItem(state: GameState, item: HousingItemDefinition): boolean {
  for (const [resourceId, cost] of Object.entries(item.cost)) {
    // Check standard resources
    if (resourceId in state.resources) {
      if ((state.resources as Record<string, number>)[resourceId] < cost) {
        return false;
      }
    }
    // Check special resources (excluding stamina and health which use nested structure)
    else if (resourceId === 'stamina') {
      if (state.specialResources.stamina.current < cost) {
        return false;
      }
    } else if (resourceId === 'health') {
      if (state.specialResources.health.current < cost) {
        return false;
      }
    }
  }
  return true;
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
        case 'skillCap':
          // value should be a string like "arcane:10" for skill-specific bonuses
          if (typeof item.value === 'string') {
            const parts = item.value.split(':');
            if (parts.length === 2) {
              const [skillId, bonusAmount] = parts;
              const bonusValue = parseInt(bonusAmount, 10);
              if (!isNaN(bonusValue)) {
                if (!bonuses.skillCap[skillId]) {
                  bonuses.skillCap[skillId] = 0;
                }
                bonuses.skillCap[skillId] += bonusValue;
              }
            }
          } else {
            bonuses.skillCap['all'] = (bonuses.skillCap['all'] || 0) + (typeof item.value === 'number' ? item.value : 0);
          }
          break;

        case 'passiveGen':
          // value should be a string like "gold:0.5" for resource generation
          if (typeof item.value === 'string') {
            const parts = item.value.split(':');
            if (parts.length === 2) {
              const [resourceId, amount] = parts;
              const genValue = parseFloat(amount);
              if (!isNaN(genValue)) {
                if (!bonuses.passiveGen[resourceId]) {
                  bonuses.passiveGen[resourceId] = 0;
                }
                bonuses.passiveGen[resourceId] += genValue;
              }
            }
          }
          break;

        case 'actionBonus':
          // value should be a string like "arcane:0.15" or a number for global bonus
          if (typeof item.value === 'string') {
            const parts = item.value.split(':');
            if (parts.length === 2) {
              const [skillId, bonusAmount] = parts;
              const bonusValue = parseFloat(bonusAmount);
              if (!isNaN(bonusValue)) {
                if (!bonuses.actionBonus[skillId]) {
                  bonuses.actionBonus[skillId] = 0;
                }
                bonuses.actionBonus[skillId] += bonusValue;
              }
            }
          } else {
            bonuses.actionBonus['all'] = (bonuses.actionBonus['all'] || 0) + (typeof item.value === 'number' ? item.value : 0);
          }
          break;

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
