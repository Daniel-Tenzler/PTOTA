import type { ActionDefinition } from '../../types';
import { createResourceAction, createTimedAction } from './factories';

/**
 * Base resource-producing actions.
 * Actions that gather or produce resources using stamina.
 */
export const RESOURCE_ACTIONS: Omit<ActionDefinition, 'rankBonus'>[] = [
  // Arcane actions
  createResourceAction({
    id: 'gain-gold',
    name: 'Gain Gold',
    outputs: { gold: 1 },
    skillId: 'arcane',
  }),
  createTimedAction({
    id: 'hunt',
    name: 'Hunt',
    inputs: {},
    outputs: { gold: 1 },
    duration: 1.5,
    skillId: 'arcane',
    xp: 1,
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
