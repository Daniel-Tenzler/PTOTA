/**
 * Skill-related type definitions.
 */

export type SkillBonusValue = string | number | boolean;

export interface SkillBonus {
  level: number;
  effect: string;
  value: SkillBonusValue;
}

export interface SkillDefinition {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  xpTable: number[];
  bonuses: SkillBonus[];
}

export interface SkillState {
  level: number;
  experience: number;
}
