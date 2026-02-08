import type { ActionDefinition } from '../types';

export const TIMED_ACTION_DEFS: Record<string, ActionDefinition> = {
  'meditate': {
    id: 'meditate',
    name: 'Meditate',
    category: 'timed',
    inputs: {},
    outputs: { gold: 0.5 },
    staminaCost: 0,
    duration: 3,
    skillXp: { arcane: 0.5 },
    rankBonus: (n: number) => {
      if (n >= 50) return 0.15;
      if (n >= 10) return 0.05;
      return 0;
    },
  },
};
