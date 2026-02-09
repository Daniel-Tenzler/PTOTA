import type { GameState, SkillDefinition, SkillState } from '../types';
import { SKILL_DEFS } from '../data/skills';
import { ACTION_DEFS, STUDY_ACTIONS } from '../data/actions';

export function checkSkillLevelUps(
  state: GameState
): Partial<GameState> {
  const updates: Partial<GameState> = {};

  for (const [skillId, skill] of Object.entries(state.skills)) {
    const def = SKILL_DEFS[skillId];
    if (!def) continue;

    const nextLevel = skill.level + 1;
    if (nextLevel > def.xpTable.length) continue; // Max level

    const xpNeeded = def.xpTable[nextLevel - 1];
    if (skill.experience >= xpNeeded) {
      // Level up!
      updates.skills = {
        ...updates.skills,
        [skillId]: {
          ...skill,
          level: nextLevel,
        },
      };

      // Check for unlocks
      const bonuses = def.bonuses.filter((b) => b.level === nextLevel);
      for (const bonus of bonuses) {
        if (bonus.effect === 'unlock-action') {
          updates.actions = {
            ...updates.actions,
            [bonus.value as string]: {
              executionCount: 0,
              isUnlocked: true,
              isActive: false,
              lastExecution: 0,
            },
          };
        } else if (bonus.effect === 'unlock-skill') {
          // Unlock all actions that grant XP to this skill
          const allActions = { ...ACTION_DEFS, ...STUDY_ACTIONS };
          for (const [actionId, actionDef] of Object.entries(allActions)) {
            if (actionDef.skillXp && actionDef.skillXp[skillId]) {
              updates.actions = {
                ...updates.actions,
                [actionId]: {
                  executionCount: 0,
                  isUnlocked: true,
                  isActive: false,
                  lastExecution: 0,
                },
              };
            }
          }
        }
      }
    }
  }

  return updates;
}

export function getSkillProgress(skill: SkillState, def: SkillDefinition): {
  current: number;
  needed: number;
  percent: number;
} {
  const nextLevel = skill.level + 1;
  if (nextLevel > def.xpTable.length) {
    return { current: skill.experience, needed: skill.experience, percent: 100 };
  }

  const currentLevelXp = skill.level > 0 ? def.xpTable[skill.level - 1] : 0;
  const nextLevelXp = def.xpTable[nextLevel - 1];
  const progress = skill.experience - currentLevelXp;
  const needed = nextLevelXp - currentLevelXp;

  return {
    current: progress,
    needed,
    percent: (progress / needed) * 100,
  };
}
