import type { GameState, ActionDefinition, ActionState } from '../types';
import { ACTION_DEFS, STUDY_ACTIONS } from '../data/actions';
import { UNLOCK_ACTION_DEFS } from '../data/unlockActions';
import { TIMED_ACTION_DEFS } from '../data/timedActions';
import { SKILL_DEFS } from '../data/skills';
import { canExecuteUnlockAction, executeUnlockAction as execUnlock } from './unlockActions';

// Merge all action definitions
export const ALL_ACTION_DEFS = { ...ACTION_DEFS, ...UNLOCK_ACTION_DEFS, ...TIMED_ACTION_DEFS, ...STUDY_ACTIONS };

/**
 * Helper function to check if an action is a study action.
 * Study actions are identified by the 'study-' prefix in their ID.
 */
export function isStudyAction(actionId: string): boolean {
  return actionId.startsWith('study-');
}

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

export function executeAction(
  state: GameState,
  actionId: string,
  definition: ActionDefinition
): Partial<GameState> {
  // Handle unlock actions
  if (definition.category === 'unlock') {
    return execUnlock(state, actionId, definition);
  }

  const updates: Partial<GameState> = {};
  const actionState: ActionState = state.actions[actionId] || {
    executionCount: 0,
    isUnlocked: true,
    isActive: false,
    lastExecution: 0,
  };

  const rankBonus = definition.rankBonus(actionState.executionCount);

  // Consume inputs
  for (const [resource, amount] of Object.entries(definition.inputs)) {
    updates.resources = {
      ...updates.resources,
      [resource]: state.resources[resource] - amount,
    };
  }

  // Consume stamina
  if (definition.staminaCost) {
    updates.specialResources = {
      ...state.specialResources,
      ...updates.specialResources,
      stamina: {
        ...state.specialResources.stamina,
        current: state.specialResources.stamina.current - definition.staminaCost,
      },
    };
  }

  // Apply outputs with rank bonus
  for (const [resource, amount] of Object.entries(definition.outputs)) {
    const bonusAmount = amount * (1 + rankBonus);

    // Handle stamina as a special resource
    if (resource === 'stamina') {
      const currentStamina = state.specialResources.stamina.current;
      const maxStamina = state.specialResources.stamina.max;
      const newStamina = Math.min(maxStamina, currentStamina + bonusAmount);
      updates.specialResources = {
        ...state.specialResources,
        ...updates.specialResources,
        stamina: {
          ...state.specialResources.stamina,
          current: newStamina,
        },
      };
    } else {
      // Regular resources
      const currentAmount = state.resources[resource] || 0;
      updates.resources = {
        ...updates.resources,
        [resource]: currentAmount + bonusAmount,
      };
    }
  }

  // Award skill XP
  if (definition.skillXp) {
    for (const [skillId, xp] of Object.entries(definition.skillXp)) {
      const currentSkill = state.skills[skillId] || { level: 1, experience: 0 };
      updates.skills = {
        ...updates.skills,
        [skillId]: {
          ...currentSkill,
          experience: currentSkill.experience + xp,
        },
      };
    }
  }

  // Update execution count
  updates.actions = {
    ...updates.actions,
    [actionId]: {
      ...actionState,
      executionCount: actionState.executionCount + 1,
      lastExecution: Date.now(),
    },
  };

  return updates;
}

export function toggleStudyAction(state: GameState, actionId: string): Partial<GameState> {
  const activeStudyId = Object.entries(state.actions)
    .find(([id, s]) => isStudyAction(id) && s.isActive)?.[0];

  const updates: Partial<GameState> = { actions: { ...state.actions } };

  // If clicking same active study, turn it off
  if (activeStudyId === actionId && state.actions[actionId].isActive) {
    updates.actions![actionId] = { ...state.actions[actionId], isActive: false };
    return updates;
  }

  // Deactivate previous study if exists
  if (activeStudyId) {
    updates.actions![activeStudyId] = { ...state.actions[activeStudyId], isActive: false };
  }

  // When activating a study action, deactivate any active non-study timed actions
  if (!state.actions[actionId].isActive) {
    for (const [id, def] of Object.entries(ALL_ACTION_DEFS)) {
      if (def.category === 'timed' && !isStudyAction(id) && state.actions[id]?.isActive) {
        updates.actions![id] = { ...state.actions[id], isActive: false };
      }
    }
  }

  // Toggle the new one
  updates.actions![actionId] = {
    ...state.actions[actionId],
    isActive: !state.actions[actionId].isActive,
  };

  return updates;
}
