import type { HouseDefinition, HousingItemDefinition } from '../types';

/**
 * Housing data definitions.
 * Houses provide space for housing items that grant various bonuses.
 */

/**
 * House definitions.
 * Each house provides a certain amount of space for housing items.
 */
export const HOUSE_DEFS: Record<string, HouseDefinition> = {
  shelter: {
    id: 'shelter',
    name: 'Shelter',
    space: 0,
    cost: {},
    description: 'A basic shelter. Provides no space for furniture.',
  },
  'small-house': {
    id: 'small-house',
    name: 'Cottage',
    space: 3,
    cost: { gold: 100 },
    description: 'A small dwelling with room for a few furnishings.',
  },
  'medium-house': {
    id: 'medium-house',
    name: 'House',
    space: 6,
    cost: { gold: 500, scrolls: 10 },
    description: 'A comfortable home with ample space for improvements.',
  },
  'large-house': {
    id: 'large-house',
    name: 'Manor',
    space: 12,
    cost: { gold: 2000, 'enchanted scrolls': 50 },
    description: 'A spacious manor suitable for a serious practitioner.',
  },
};

/**
 * Housing item definitions.
 * Items provide various bonuses when equipped in a house.
 *
 * Categories:
 * - Skill Cap: Increases maximum level for skills
 * - Passive Gen: Generates resources passively
 * - Action Bonus: Improves action effectiveness
 * - Combat Bonus: Enhances combat capabilities
 */
export const HOUSING_ITEM_DEFS: Record<string, HousingItemDefinition> = {
  // === SKILL CAP ITEMS ===
  'arcane-study': {
    id: 'arcane-study',
    name: 'Desk',
    space: 2,
    cost: { gold: 500, scrolls: 20 },
    description: '+10 Arcane level cap',
    effect: 'skillCap',
    value: 'arcane:10',
  },
  'pyromancy-forge': {
    id: 'pyromancy-forge',
    name: 'Workbench',
    space: 2,
    cost: { gold: 800, ash: 50 },
    description: '+10 Pyromancy level cap',
    effect: 'skillCap',
    value: 'pyromancy:10',
  },
  'hydromancy-basin': {
    id: 'hydromancy-basin',
    name: 'Basin',
    space: 2,
    cost: { gold: 800, springWater: 50 },
    description: '+10 Hydromancy level cap',
    effect: 'skillCap',
    value: 'hydromancy:10',
  },
  'geomancy-shrine': {
    id: 'geomancy-shrine',
    name: 'Altar',
    space: 2,
    cost: { gold: 800, ore: 50 },
    description: '+10 Geomancy level cap',
    effect: 'skillCap',
    value: 'geomancy:10',
  },

  // === PASSIVE GENERATION ITEMS ===
  'gold-reserve': {
    id: 'gold-reserve',
    name: 'Chest',
    space: 1,
    cost: { gold: 1000 },
    description: '+0.2 gold/sec',
    effect: 'passiveGen',
    value: 'gold:0.2',
  },
  'scroll-rack': {
    id: 'scroll-rack',
    name: 'Bookshelf',
    space: 2,
    cost: { gold: 1500, 'enchanted scrolls': 30 },
    description: '+0.1 scrolls/sec',
    effect: 'passiveGen',
    value: 'scrolls:0.1',
  },
  'ash-collector': {
    id: 'ash-collector',
    name: 'Funnel',
    space: 1,
    cost: { gold: 800, ash: 20 },
    description: '+0.3 ash/sec',
    effect: 'passiveGen',
    value: 'ash:0.3',
  },
  'spring-barrel': {
    id: 'spring-barrel',
    name: 'Tank',
    space: 1,
    cost: { gold: 800, springWater: 20 },
    description: '+0.3 spring water/sec',
    effect: 'passiveGen',
    value: 'springWater:0.3',
  },
  'ore-crusher': {
    id: 'ore-crusher',
    name: 'Anvil',
    space: 2,
    cost: { gold: 1200, ore: 30 },
    description: '+0.2 ore/sec',
    effect: 'passiveGen',
    value: 'ore:0.2',
  },

  // === ACTION BONUS ITEMS ===
  'arcane-focus': {
    id: 'arcane-focus',
    name: 'Lamp',
    space: 2,
    cost: { gold: 1000, 'enchanted scrolls': 20 },
    description: '+15% action effectiveness',
    effect: 'actionBonus',
    value: 15,
  },
  'mana-infused-table': {
    id: 'mana-infused-table',
    name: 'Enchanter\'s Table',
    space: 3,
    cost: { gold: 2000, 'enchanted scrolls': 50, voidSalts: 20 },
    description: '+25% action effectiveness',
    effect: 'actionBonus',
    value: 25,
    requiresUnlock: true,
  },

  // === COMBAT BONUS ITEMS ===
  'combat-mannequin': {
    id: 'combat-mannequin',
    name: 'Training Dummy',
    space: 3,
    cost: { gold: 1500, ore: 30 },
    description: '+2 damage in combat',
    effect: 'combatDamage',
    value: 2,
  },
  'weapon-rack': {
    id: 'weapon-rack',
    name: 'Weapon Rack',
    space: 4,
    cost: { gold: 3000, 'enchanted scrolls': 40 },
    description: '+5 damage in combat',
    effect: 'combatDamage',
    value: 5,
    requiresUnlock: true,
  },
  'enchanted-armor-stand': {
    id: 'enchanted-armor-stand',
    name: 'Armor Stand',
    space: 4,
    cost: { gold: 2500, 'enchanted scrolls': 60 },
    description: '+0.5 health/sec regeneration',
    effect: 'healthRegen',
    value: 0.5,
    requiresUnlock: true,
  },

  // === SPELL COOLDOWN ITEMS ===
  'spell-empowerment-circle': {
    id: 'spell-empowerment-circle',
    name: 'Ritual Circle',
    space: 4,
    cost: { gold: 4000, 'enchanted scrolls': 80, stormGlass: 30 },
    description: '-10% spell cooldowns',
    effect: 'spellCooldown',
    value: 10,
    requiresUnlock: true,
  },
};
