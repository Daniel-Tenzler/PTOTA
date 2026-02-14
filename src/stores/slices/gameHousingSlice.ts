import type { GameState } from '../../types';
import { canAffordHouse, canAffordItem, getSpaceUsed } from '../../systems/housing';
import { HOUSE_DEFS, HOUSING_ITEM_DEFS } from '../../data/housing';
import { deductCost } from '../../systems/resources';
import { updateHousingEquippedItems, updateHousingItemLocation, removeHousingItemLocation, mergeUpdates } from '../../utils/immutableUpdates';

export interface GameHousingSlice {
  purchaseHouse: (houseId: string) => void;
  equipItem: (houseId: string, itemId: string) => void;
  unequipItem: (houseId: string, itemId: string) => void;
  unequipItemById: (itemId: string) => void;
}

export const createHousingSlice = (
  set: (partial: Partial<GameState>) => void,
  get: () => GameState
): GameHousingSlice => ({
  purchaseHouse: (houseId: string) => {
    const state = get();
    const house = HOUSE_DEFS[houseId];

    if (!house) return;
    if (state.housing.ownedHouses.includes(houseId)) return;
    if (!canAffordHouse(state, house)) return;

    // Deduct costs using centralized function
    const costUpdates = deductCost(state, house.cost);

    // Add to owned houses and initialize empty equipped items
    const housingUpdate = {
      ...state.housing,
      ownedHouses: [...state.housing.ownedHouses, houseId],
      equippedItems: {
        ...state.housing.equippedItems,
        [houseId]: [],
      },
    };

    set({
      ...costUpdates,
      housing: housingUpdate,
    });
  },

  equipItem: (houseId: string, itemId: string) => {
    const state = get();
    const house = HOUSE_DEFS[houseId];
    const item = HOUSING_ITEM_DEFS[itemId];

    if (!house || !item) return;
    if (!state.housing.ownedHouses.includes(houseId)) return;
    if (!canAffordItem(state, item)) return;

    // Check if item already equipped anywhere using reverse lookup
    if (state.housing.itemLocation[itemId]) return;

    // Check space limit
    const currentSpaceUsed = getSpaceUsed(state, houseId, (id) => HOUSING_ITEM_DEFS[id]);
    if (currentSpaceUsed + item.space > house.space) return;

    // Deduct costs using centralized function
    const costUpdates = deductCost(state, item.cost);

    // Get current equipped items for this house
    const equippedItems = state.housing.equippedItems[houseId] || [];
    const updatedEquippedItems = [...equippedItems, itemId];

    // Merge updates: cost + equipped items + item location
    set(mergeUpdates(
      costUpdates,
      updateHousingEquippedItems(state, houseId, updatedEquippedItems),
      updateHousingItemLocation(state, { [itemId]: houseId })
    ));
  },

  unequipItem: (houseId: string, itemId: string) => {
    const state = get();
    const equippedItems = state.housing.equippedItems[houseId] || [];

    if (!equippedItems.includes(itemId)) return;

    const updatedEquippedItems = equippedItems.filter((id) => id !== itemId);

    // Merge updates: remove from equipped items + remove from item location
    set(mergeUpdates(
      updateHousingEquippedItems(state, houseId, updatedEquippedItems),
      removeHousingItemLocation(state, itemId)
    ));
  },

  unequipItemById: (itemId: string) => {
    const state = get();
    const houseId = state.housing.itemLocation[itemId];
    if (!houseId) return;

    const equippedItems = state.housing.equippedItems[houseId] || [];
    if (!equippedItems.includes(itemId)) return;

    const updatedEquippedItems = equippedItems.filter((id) => id !== itemId);

    // Merge updates: remove from equipped items + remove from item location
    set(mergeUpdates(
      updateHousingEquippedItems(state, houseId, updatedEquippedItems),
      removeHousingItemLocation(state, itemId)
    ));
  },
});
