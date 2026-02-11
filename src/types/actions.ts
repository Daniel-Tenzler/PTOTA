import type { SkillBonusValue } from './skills';

/**
 * Action-related type definitions.
 */

export type ActionCategory = 'resource-producing' | 'resource-processing' | 'timed' | 'unlock';

export interface ActionDefinition {
  id: string;
  name: string;
  category: ActionCategory;
  inputs: { [resourceId: string]: number };
  outputs: { [resourceId: string]: number };
  staminaCost?: number;
  duration?: number;  // 0 = instant, >0 = timed
  skillXp?: { [skillId: string]: number };
  requiredSkill?: { skillId: string; level: number };
  unlockCost?: { [resourceId: string]: number };
  rankBonus: (executions: number) => number;
  effect?: string;  // For unlock actions: 'unlock-spell-slot', 'unlock-action', etc.
  value?: SkillBonusValue;  // Value associated with the effect
}

export interface ActionState {
  executionCount: number;
  isUnlocked: boolean;
  isActive: boolean;
  lastExecution: number;
}
