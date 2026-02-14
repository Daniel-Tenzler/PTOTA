import type { ActionDefinition } from '../../types';
import { noRankBonus } from '../../utils/rankBonus';

/**
 * Unlock actions for housing items that require special unlocks.
 * These actions use the 'unlock' category and don't have rank bonuses.
 */
export const HOUSING_UNLOCK_ACTIONS: ActionDefinition[] = [
  {
    id: 'unlock-mana-infused-table',
    name: 'Learn: Mana-Infused Table',
    category: 'unlock',
    inputs: {},
    outputs: {},
    staminaCost: 0,
    duration: 0,
    skillXp: { arcane: 0 },
    requiredSkill: { skillId: 'arcane', level: 5 },
    unlockCost: { gold: 500, 'enchanted scrolls': 10 },
    effect: 'unlock-housing-item',
    value: 'mana-infused-table',
    rankBonus: noRankBonus,
  },
  {
    id: 'unlock-weapon-rack',
    name: 'Learn: Weapon Rack',
    category: 'unlock',
    inputs: {},
    outputs: {},
    staminaCost: 0,
    duration: 0,
    skillXp: { pyromancy: 0 },
    requiredSkill: { skillId: 'pyromancy', level: 3 },
    unlockCost: { gold: 1000, ash: 30 },
    effect: 'unlock-housing-item',
    value: 'weapon-rack',
    rankBonus: noRankBonus,
  },
  {
    id: 'unlock-enchanted-armor-stand',
    name: 'Learn: Enchanted Armor Stand',
    category: 'unlock',
    inputs: {},
    outputs: {},
    staminaCost: 0,
    duration: 0,
    skillXp: { geomancy: 0 },
    requiredSkill: { skillId: 'geomancy', level: 5 },
    unlockCost: { gold: 800, ore: 40 },
    effect: 'unlock-housing-item',
    value: 'enchanted-armor-stand',
    rankBonus: noRankBonus,
  },
  {
    id: 'unlock-spell-empowerment-circle',
    name: 'Learn: Spell Empowerment Circle',
    category: 'unlock',
    inputs: {},
    outputs: {},
    staminaCost: 0,
    duration: 0,
    skillXp: { aeromancy: 0 },
    requiredSkill: { skillId: 'aeromancy', level: 5 },
    unlockCost: { gold: 2000, stormGlass: 20, 'enchanted scrolls': 30 },
    effect: 'unlock-housing-item',
    value: 'spell-empowerment-circle',
    rankBonus: noRankBonus,
  },
];
