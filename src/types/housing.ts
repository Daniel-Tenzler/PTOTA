/**
 * Housing-related type definitions.
 */

/**
 * Types of housing effects that can be provided by housing items.
 */
export type HousingEffect =
  | 'skillCap'        // Increases skill level cap
  | 'passiveGen'      // Passive resource generation
  | 'actionBonus'     // Bonus to action effectiveness
  | 'combatDamage'    // Bonus to combat damage
  | 'healthRegen'     // Health regeneration rate increase
  | 'spellCooldown';  // Spell cooldown reduction

/**
 * Definition for a house (housing building).
 * Houses provide space that can be filled with housing items.
 */
export interface HouseDefinition {
  id: string;
  name: string;
  space: number;              // Number of item slots available
  cost: { [resourceId: string]: number };
  description: string;
}

/**
 * Definition for a housing item (furniture/decoration).
 * Items take up space and provide various effects.
 */
export interface HousingItemDefinition {
  id: string;
  name: string;
  space: number;              // How many slots this item occupies
  cost: { [resourceId: string]: number };
  description: string;
  effect: HousingEffect;
  value: number | string;     // The magnitude/effect value
  requiresUnlock?: boolean;    // Whether this item needs to be unlocked
}

/**
 * Aggregated bonuses from all equipped housing items.
 * This represents the total bonuses the player receives from their housing setup.
 */
export interface HousingBonuses {
  skillCap: { [skillId: string]: number };  // Added to skill level caps (per-skill or 'all')
  passiveGen: { [resourceId: string]: number };  // Resources per second
  actionBonus: { [skillId: string]: number }; // Percentage bonus to action effectiveness (per-skill or 'all')
  combatDamage: number;        // Flat damage bonus
  healthRegen: number;         // Health per second
  spellCooldown: number;       // Cooldown reduction percentage
}

/**
 * State for the housing system.
 * Tracks owned houses and equipped items.
 */
export interface HousingState {
  ownedHouses: string[];       // IDs of owned houses
  equippedItems: {             // Map of house ID to equipped item IDs
    [houseId: string]: string[];
  };
  unlockedItems: string[];       // IDs of unlocked housing items
  itemLocation: {              // Reverse lookup: itemId -> houseId (for optimized unequip)
    [itemId: string]: string;
  };
}
