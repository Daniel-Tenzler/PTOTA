import type { GameState, ActionDefinition, ActionState, SpecialResources } from '../../types';
import { awardSkillXp } from '../skills/skillUtils';

/**
 * Helper functions for processing action inputs and outputs.
 * Separated from actionExecutor for better testability and reusability.
 */

interface ResourceUpdate {
  resources?: { [resourceId: string]: number };
  specialResources?: SpecialResources;
}

/**
 * Consumes input resources for an action execution.
 * Returns the resource updates to apply.
 */
export function consumeInputs(
  state: GameState,
  definition: ActionDefinition
): ResourceUpdate {
  const updates: ResourceUpdate = {};

  for (const [resource, amount] of Object.entries(definition.inputs)) {
    updates.resources = {
      ...updates.resources,
      [resource]: state.resources[resource] - amount,
    };
  }

  return updates;
}

/**
 * Consumes stamina for an action execution.
 * Returns the special resources updates to apply.
 */
export function consumeStamina(
  state: GameState,
  definition: ActionDefinition
): ResourceUpdate {
  if (!definition.staminaCost) {
    return {};
  }

  return {
    specialResources: {
      ...state.specialResources,
      stamina: {
        ...state.specialResources.stamina,
        current: state.specialResources.stamina.current - definition.staminaCost,
      },
    },
  };
}

/**
 * Produces output resources with rank bonus applied.
 * Returns the resource updates to apply.
 */
export function produceOutputs(
  state: GameState,
  definition: ActionDefinition,
  rankBonus: number
): ResourceUpdate {
  const updates: ResourceUpdate = {};

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

  return updates;
}

/**
 * Awards skill XP for an action execution.
 * Returns the game state updates to apply.
 */
export function awardActionSkillXp(
  state: GameState,
  definition: ActionDefinition
): Partial<GameState> {
  if (!definition.skillXp) {
    return {};
  }

  const updates: Partial<GameState> = {};
  for (const [skillId, xp] of Object.entries(definition.skillXp)) {
    Object.assign(updates, awardSkillXp(state, skillId, xp));
  }
  return updates;
}

/**
 * Updates the action state after execution.
 * Returns the updated action state.
 */
export function updateActionState(
  actionState: ActionState
): ActionState {
  return {
    ...actionState,
    executionCount: actionState.executionCount + 1,
    lastExecution: Date.now(),
  };
}
