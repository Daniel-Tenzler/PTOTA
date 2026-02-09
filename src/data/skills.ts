import type { SkillDefinition } from '../types';

/**
 * Standard XP table for skills.
 * Each value represents the cumulative XP required for that level (1-10).
 * Example: Level 3 requires 300 total XP (150 XP to reach level 2, +150 XP to reach level 3).
 */
export const STANDARD_XP_TABLE = [0, 50, 150, 300, 500, 750, 1050, 1400, 1800, 2250];

export const SKILL_DEFS: Record<string, SkillDefinition> = {
  arcane: {
    id: 'arcane',
    name: 'Arcane',
    xpTable: STANDARD_XP_TABLE,
    bonuses: [
      { level: 2, effect: 'unlock-action', value: 'enchant-scrolls' },
      { level: 2, effect: 'unlock-action', value: 'gather-ash' },
      { level: 2, effect: 'unlock-action', value: 'collect-spring-water' },
      { level: 2, effect: 'unlock-action', value: 'mine-ore' },
      { level: 5, effect: 'unlock-spell-slot', value: 1 },
      { level: 5, effect: 'unlock-skill', value: 'alchemy' },
    ],
  },
  pyromancy: {
    id: 'pyromancy',
    name: 'Pyromancy',
    xpTable: STANDARD_XP_TABLE,
    bonuses: [
      { level: 5, effect: 'unlock-spell-slot', value: 1 },
      { level: 5, effect: 'unlock-skill', value: 'necromancy' },
    ],
  },
  hydromancy: {
    id: 'hydromancy',
    name: 'Hydromancy',
    xpTable: STANDARD_XP_TABLE,
    bonuses: [
      { level: 5, effect: 'unlock-spell-slot', value: 1 },
      { level: 5, effect: 'unlock-skill', value: 'aeromancy' },
    ],
  },
  geomancy: {
    id: 'geomancy',
    name: 'Geomancy',
    xpTable: STANDARD_XP_TABLE,
    bonuses: [
      { level: 5, effect: 'unlock-spell-slot', value: 1 },
    ],
  },
  necromancy: {
    id: 'necromancy',
    name: 'Necromancy',
    xpTable: STANDARD_XP_TABLE,
    bonuses: [
      { level: 5, effect: 'unlock-spell-slot', value: 1 },
    ],
  },
  alchemy: {
    id: 'alchemy',
    name: 'Alchemy',
    xpTable: STANDARD_XP_TABLE,
    bonuses: [
      { level: 5, effect: 'unlock-spell-slot', value: 1 },
    ],
  },
  aeromancy: {
    id: 'aeromancy',
    name: 'Aeromancy',
    xpTable: STANDARD_XP_TABLE,
    bonuses: [
      { level: 5, effect: 'unlock-spell-slot', value: 1 },
    ],
  },
};
