import type { GameState, ActionDefinition } from '../../types';
import { SKILL_DEFS } from '../../data/skills';
import { canExecuteUnlockAction } from '../unlockActions';
import { isStudyAction } from './actionRegistry';

/**
 * Action validation system.
 * Validates whether an action can be executed based on game state.
 */

/**
 * Validates whether an action can be executed based on the current game state.
 *
 * Checks:
 * - Unlock action specific requirements
 * - Action unlock status (starter actions are auto-unlocked)
 * - Stamina availability
 * - Input resource availability
 * - Skill level requirements
 * - Study action target skill max level constraint
 *
 * @param state - Current game state
 * @param actionId - ID of the action to validate
 * @param definition - Action definition containing requirements
 * @returns True if the action can be executed, false otherwise
 */
export function canExecuteAction(
  state: GameState,
  actionId: string,
  definition: ActionDefinition
): boolean {
  const action = state.actions[actionId];

  // Handle unlock actions
  if (definition.category === 'unlock') {
    return canExecuteUnlockAction(state, actionId, definition);
  }

  // Check if unlocked
  if (!action?.isUnlocked) {
    // Starter actions are auto-unlocked
    const isStarter = actionId === 'gain-gold' || actionId === 'write-scrolls' || actionId === 'meditate';
    if (!isStarter) return false;
  }

  // Check stamina
  if (definition.staminaCost) {
    if (state.specialResources.stamina.current < definition.staminaCost) {
      return false;
    }
  }

  // Check input resources
  for (const [resource, amount] of Object.entries(definition.inputs)) {
    if ((state.resources[resource] || 0) < amount) {
      return false;
    }
  }

  // Check skill requirements
  if (definition.requiredSkill) {
    const skill = state.skills[definition.requiredSkill.skillId];
    if (!skill || skill.level < definition.requiredSkill.level) {
      return false;
    }
  }

  // Check if study action target skill is at max level
  if (isStudyAction(actionId) && definition.skillXp) {
    const skillIds = Object.keys(definition.skillXp);
    if (skillIds.length > 0) {
      const skillId = skillIds[0];
      const skillDef = SKILL_DEFS[skillId];
      const skillState = state.skills[skillId];

      if (skillDef && skillState && skillState.level >= skillDef.xpTable.length) {
        return false;
      }
    }
  }

  return true;
}
