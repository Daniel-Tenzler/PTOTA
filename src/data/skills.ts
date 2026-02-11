import type { SkillDefinition, SkillBonus } from '../types';

/**
 * Standard XP table for skills.
 * Each value represents the cumulative XP required for that level (1-10).
 * Example: Level 3 requires 300 total XP (150 XP to reach level 2, +150 XP to reach level 3).
 */
export const STANDARD_XP_TABLE = [0, 50, 150, 300, 500, 750, 1050, 1400, 1800, 2250];

/**
 * Common skill bonus: unlock a spell slot at level 5.
 */
const SPELL_SLOT_BONUS: SkillBonus = {
  level: 5,
  effect: 'unlock-spell-slot',
  value: 1,
};

/**
 * Creates an action unlock bonus for a specific level.
 */
function createActionUnlockBonus(level: number, actionId: string): SkillBonus {
  return {
    level,
    effect: 'unlock-action',
    value: actionId,
  };
}

/**
 * Creates a skill unlock bonus for a specific level.
 */
function createSkillUnlockBonus(level: number, skillId: string): SkillBonus {
  return {
    level,
    effect: 'unlock-skill',
    value: skillId,
  };
}

export const SKILL_DEFS: Record<string, SkillDefinition> = {
  arcane: {
    id: 'arcane',
    name: 'Arcane',
    icon: 'Wand2',
    color: 'purple',
    xpTable: STANDARD_XP_TABLE,
    bonuses: [
      createActionUnlockBonus(2, 'enchant-scrolls'),
      createActionUnlockBonus(2, 'gather-ash'),
      createActionUnlockBonus(2, 'collect-spring-water'),
      createActionUnlockBonus(2, 'mine-ore'),
      SPELL_SLOT_BONUS,
      createSkillUnlockBonus(5, 'alchemy'),
    ],
  },
  pyromancy: {
    id: 'pyromancy',
    name: 'Pyromancy',
    color: 'orange',
    xpTable: STANDARD_XP_TABLE,
    bonuses: [
      SPELL_SLOT_BONUS,
      createSkillUnlockBonus(5, 'necromancy'),
    ],
  },
  hydromancy: {
    id: 'hydromancy',
    name: 'Hydromancy',
    color: 'blue',
    xpTable: STANDARD_XP_TABLE,
    bonuses: [
      SPELL_SLOT_BONUS,
      createSkillUnlockBonus(5, 'aeromancy'),
    ],
  },
  geomancy: {
    id: 'geomancy',
    name: 'Geomancy',
    color: 'yellow',
    xpTable: STANDARD_XP_TABLE,
    bonuses: [SPELL_SLOT_BONUS],
  },
  necromancy: {
    id: 'necromancy',
    name: 'Necromancy',
    color: 'green',
    xpTable: STANDARD_XP_TABLE,
    bonuses: [SPELL_SLOT_BONUS],
  },
  alchemy: {
    id: 'alchemy',
    name: 'Alchemy',
    color: 'pink',
    xpTable: STANDARD_XP_TABLE,
    bonuses: [SPELL_SLOT_BONUS],
  },
  aeromancy: {
    id: 'aeromancy',
    name: 'Aeromancy',
    color: 'cyan',
    xpTable: STANDARD_XP_TABLE,
    bonuses: [SPELL_SLOT_BONUS],
  },
};
