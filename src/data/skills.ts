import type { SkillDefinition } from '../types';

export const SKILL_DEFS: Record<string, SkillDefinition> = {
  arcane: {
    id: 'arcane',
    name: 'Arcane',
    xpTable: [0, 50, 150, 300, 500, 750, 1050, 1400, 1800, 2250], // Level 1-10
    bonuses: [
      { level: 2, effect: 'unlock-action', value: 'enchant-scrolls' },
      { level: 2, effect: 'unlock-action', value: 'gather-ash' },
      { level: 2, effect: 'unlock-action', value: 'collect-spring-water' },
      { level: 2, effect: 'unlock-action', value: 'mine-ore' },
      { level: 5, effect: 'unlock-spell-slot', value: 1 },
    ],
  },
  pyromancy: {
    id: 'pyromancy',
    name: 'Pyromancy',
    xpTable: [0, 50, 150, 300, 500, 750, 1050, 1400, 1800, 2250], // Level 1-10
    bonuses: [
      { level: 5, effect: 'unlock-spell-slot', value: 1 },
    ],
  },
  hydromancy: {
    id: 'hydromancy',
    name: 'Hydromancy',
    xpTable: [0, 50, 150, 300, 500, 750, 1050, 1400, 1800, 2250], // Level 1-10
    bonuses: [
      { level: 5, effect: 'unlock-spell-slot', value: 1 },
    ],
  },
  geomancy: {
    id: 'geomancy',
    name: 'Geomancy',
    xpTable: [0, 50, 150, 300, 500, 750, 1050, 1400, 1800, 2250], // Level 1-10
    bonuses: [
      { level: 5, effect: 'unlock-spell-slot', value: 1 },
    ],
  },
};
