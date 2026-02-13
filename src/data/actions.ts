import type { ActionDefinition } from '../types';
import { standardRankBonus, noRankBonus } from '../utils/rankBonus';

/**
 * Action factory functions.
 * Provides factory methods to create action definitions with common patterns.
 */

/**
 * Creates a resource-producing action definition.
 * Resource-producing actions convert stamina (and optionally inputs) into outputs.
 *
 * @param config - Action configuration
 * @returns A resource-producing action definition
 */
function createResourceAction(config: {
  id: string;
  name: string;
  outputs: Record<string, number>;
  skillId: string;
  inputs?: Record<string, number>;
  xp?: number;
}): ActionDefinition {
  return {
    id: config.id,
    name: config.name,
    category: 'resource-producing',
    inputs: config.inputs || {},
    outputs: config.outputs,
    staminaCost: 1,
    duration: 0,
    skillXp: { [config.skillId]: config.xp ?? 1 },
    rankBonus: standardRankBonus,
  };
}

/**
 * Creates a timed action definition with inputs, outputs, and duration.
 * Timed actions take time to complete and consume stamina.
 *
 * @param config - Action configuration
 * @returns A timed action definition
 */
function createTimedAction(config: {
  id: string;
  name: string;
  inputs: Record<string, number>;
  outputs: Record<string, number>;
  duration: number;
  skillId: string;
  xp?: number;
}): ActionDefinition {
  return {
    id: config.id,
    name: config.name,
    category: 'timed',
    inputs: config.inputs,
    outputs: config.outputs,
    staminaCost: 1,
    duration: config.duration,
    skillXp: { [config.skillId]: config.xp ?? 1 },
    rankBonus: standardRankBonus,
  };
}

/**
 * Creates a study action definition for the given skill.
 * Study actions are timed actions that grant XP in a specific discipline.
 */
function createStudyAction(
  skillId: string,
  displayName: string
): ActionDefinition {
  return {
    id: `study-${skillId}`,
    name: `Study ${displayName}`,
    category: 'timed',
    inputs: {},
    outputs: {},
    duration: 1,
    skillXp: { [skillId]: 1 },
    rankBonus: noRankBonus,
  };
}

/**
 * Display names for study actions.
 * Maps skill IDs to their human-readable display names.
 */
const STUDY_ACTION_DISPLAY_NAMES: Record<string, string> = {
  arcane: 'Arcane',
  pyromancy: 'Pyromancy',
  hydromancy: 'Hydromancy',
  geomancy: 'Geomancy',
  necromancy: 'Necromancy',
  alchemy: 'Alchemy',
  aeromancy: 'Aeromancy',
};

/**
 * Generates all study action definitions.
 */
export const STUDY_ACTIONS: Record<string, ActionDefinition> = Object.fromEntries(
  Object.entries(STUDY_ACTION_DISPLAY_NAMES).map(([skillId, displayName]) => [
    `study-${skillId}`,
    createStudyAction(skillId, displayName),
  ])
);

/**
 * Base resource-producing actions.
 * Actions that gather or produce resources using stamina.
 */
const RESOURCE_ACTIONS: Omit<ActionDefinition, 'rankBonus'>[] = [
  // Arcane actions
  createResourceAction({
    id: 'gain-gold',
    name: 'Gain Gold',
    outputs: { gold: 1 },
    skillId: 'arcane',
  }),
  createResourceAction({
    id: 'write-scrolls',
    name: 'Write Scrolls',
    inputs: { gold: 2 },
    outputs: { scrolls: 1 },
    skillId: 'arcane',
    xp: 2,
  }),
  createTimedAction({
    id: 'enchant-scrolls',
    name: 'Enchant Scrolls',
    inputs: { scrolls: 2 },
    outputs: { 'enchanted scrolls': 1 },
    duration: 3,
    skillId: 'arcane',
    xp: 2,
  }),

  // Pyromancy actions
  createResourceAction({
    id: 'gather-ash',
    name: 'Gather Ash',
    outputs: { ash: 1 },
    skillId: 'pyromancy',
  }),

  // Hydromancy actions
  createResourceAction({
    id: 'collect-spring-water',
    name: 'Collect Spring Water',
    outputs: { springWater: 1 },
    skillId: 'hydromancy',
  }),

  // Geomancy actions
  createResourceAction({
    id: 'mine-ore',
    name: 'Mine Ore',
    outputs: { ore: 1 },
    skillId: 'geomancy',
  }),

  // Necromancy actions
  createResourceAction({
    id: 'harvest-bone-dust',
    name: 'Harvest Bone Dust',
    outputs: { boneDust: 1 },
    skillId: 'necromancy',
  }),

  // Alchemy actions
  createResourceAction({
    id: 'transmute-void-salts',
    name: 'Transmute Void Salts',
    outputs: { voidSalts: 1 },
    skillId: 'alchemy',
  }),

  // Aeromancy actions
  createResourceAction({
    id: 'capture-storm-glass',
    name: 'Capture Storm Glass',
    outputs: { stormGlass: 1 },
    skillId: 'aeromancy',
  }),
];

/**
 * Unlock actions for housing items that require special unlocks.
 * These actions use the 'unlock' category and don't have rank bonuses.
 */
const HOUSING_UNLOCK_ACTIONS: ActionDefinition[] = [
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

/**
 * All base action definitions.
 * Apply rankBonus function to each resource action.
 */
export const ACTION_DEFS: Record<string, ActionDefinition> = Object.fromEntries([
  ...RESOURCE_ACTIONS.map(action => [action.id, { ...action, rankBonus: standardRankBonus }]),
  ...HOUSING_UNLOCK_ACTIONS.map(action => [action.id, action]),
]);
