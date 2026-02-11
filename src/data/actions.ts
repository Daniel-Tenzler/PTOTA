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
 * All base action definitions.
 * Apply rankBonus function to each resource action.
 */
export const ACTION_DEFS: Record<string, ActionDefinition> = Object.fromEntries(
  RESOURCE_ACTIONS.map(action => [action.id, { ...action, rankBonus: standardRankBonus }])
);
