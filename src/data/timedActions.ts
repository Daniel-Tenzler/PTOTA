import type { ActionDefinition } from '../types';
import { timedRankBonus } from '../utils/rankBonus';

export const TIMED_ACTION_DEFS: Record<string, ActionDefinition> = {
  'meditate': {
    id: 'meditate',
    name: 'Meditate',
    category: 'timed',
    inputs: {},
    outputs: { stamina: 1 },
    staminaCost: 0,
    duration: 1,
    skillXp: { arcane: 0.5 },
    rankBonus: timedRankBonus,
  },
};
