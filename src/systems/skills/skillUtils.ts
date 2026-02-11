import type { GameState, SkillState } from '../../types';

/**
 * Skill utility functions.
 * Provides helper functions for skill state management.
 */

/**
 * Awards experience to a skill and returns the updated state.
 *
 * @param state - Current game state
 * @param skillId - ID of the skill to award XP to
 * @param xp - Amount of experience to award
 * @returns Partial game state with skill updates applied
 */
export function awardSkillXp(
  state: GameState,
  skillId: string,
  xp: number
): Partial<GameState> {
  const currentSkill: SkillState = state.skills[skillId] || { level: 1, experience: 0 };

  return {
    skills: {
      [skillId]: {
        ...currentSkill,
        experience: currentSkill.experience + xp,
      },
    },
  };
}
