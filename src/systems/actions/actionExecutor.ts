import type { GameState, ActionDefinition, ActionState } from '../../types';
import { executeUnlockAction as execUnlock } from '../unlockActions';

/**
 * Action execution system.
 * Handles action execution and state updates.
 */

/**
 * Executes an action and returns the game state updates.
 *
 * Handles:
 * - Unlock actions (delegates to unlockActions system)
 * - Input resource consumption
 * - Stamina consumption
 * - Output resource production with rank bonus
 * - Skill XP awards
 * - Execution count tracking
 *
 * @param state - Current game state
 * @param actionId - ID of the action to execute
 * @param definition - Action definition containing execution parameters
 * @returns Partial game state with updates to apply
 */
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
