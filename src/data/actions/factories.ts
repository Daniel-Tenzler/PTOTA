import type { ActionDefinition } from '../../types';
import { standardRankBonus, noRankBonus, timedRankBonus } from '../../utils/rankBonus';

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
 *
 * @example
 * ```typescript
 * createResourceAction({
 *   id: 'gain-gold',
 *   name: 'Gain Gold',
 *   outputs: { gold: 1 },
 *   skillId: 'arcane',
 *   xp: 1,
 * })
 * // Returns: { id: 'gain-gold', name: 'Gain Gold', category: 'resource-producing', ... }
 * ```
 */
export function createResourceAction(config: {
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
 *
 * @example
 * ```typescript
 * createTimedAction({
 *   id: 'enchant-scrolls',
 *   name: 'Enchant Scrolls',
 *   inputs: { scrolls: 2 },
 *   outputs: { 'enchanted scrolls': 1 },
 *   duration: 3,
 *   skillId: 'arcane',
 *   xp: 2,
 * })
 * // Returns: { id: 'enchant-scrolls', name: 'Enchant Scrolls', category: 'timed', duration: 3, ... }
 * ```
 */
export function createTimedAction(config: {
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
    rankBonus: timedRankBonus,
  };
}

/**
 * Creates a study action definition for the given skill.
 * Study actions are timed actions that grant XP in a specific discipline.
 */
export function createStudyAction(
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
export const STUDY_ACTION_DISPLAY_NAMES: Record<string, string> = {
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
