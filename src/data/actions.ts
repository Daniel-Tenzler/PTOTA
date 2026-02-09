import type { ActionDefinition } from '../types';

export const ACTION_DEFS: Record<string, ActionDefinition> = {
  'gain-gold': {
    id: 'gain-gold',
    name: 'Gain Gold',
    category: 'resource-producing',
    inputs: {},
    outputs: { gold: 1 },
    staminaCost: 1,
    duration: 0,
    skillXp: { arcane: 1 },
    rankBonus: (executions: number) => {
      if (executions >= 100) return 0.2; // +20%
      if (executions >= 10) return 0.1;  // +10%
      return 0;
    },
  },
  'write-scrolls': {
    id: 'write-scrolls',
    name: 'Write Scrolls',
    category: 'resource-producing',
    inputs: { gold: 2 },
    outputs: { scrolls: 1 },
    staminaCost: 1,
    duration: 0,
    skillXp: { arcane: 2 },
    rankBonus: (executions: number) => {
      if (executions >= 100) return 0.2;
      if (executions >= 10) return 0.1;
      return 0;
    },
  },
  'gather-ash': {
    id: 'gather-ash',
    name: 'Gather Ash',
    category: 'resource-producing',
    inputs: {},
    outputs: { ash: 1 },
    staminaCost: 1,
    duration: 0,
    skillXp: { pyromancy: 1 },
    rankBonus: (executions: number) => {
      if (executions >= 100) return 0.2;
      if (executions >= 10) return 0.1;
      return 0;
    },
  },
  'collect-spring-water': {
    id: 'collect-spring-water',
    name: 'Collect Spring Water',
    category: 'resource-producing',
    inputs: {},
    outputs: { springWater: 1 },
    staminaCost: 1,
    duration: 0,
    skillXp: { hydromancy: 1 },
    rankBonus: (executions: number) => {
      if (executions >= 100) return 0.2;
      if (executions >= 10) return 0.1;
      return 0;
    },
  },
  'mine-ore': {
    id: 'mine-ore',
    name: 'Mine Ore',
    category: 'resource-producing',
    inputs: {},
    outputs: { ore: 1 },
    staminaCost: 1,
    duration: 0,
    skillXp: { geomancy: 1 },
    rankBonus: (executions: number) => {
      if (executions >= 100) return 0.2;
      if (executions >= 10) return 0.1;
      return 0;
    },
  },
};
