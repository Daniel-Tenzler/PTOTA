import type { GameState, ActionDefinition, ActionState, SpecialResources } from '../../types';
import { awardSkillXp } from '../skills/skillUtils';
import { getHousingBonuses } from '../housing';
import { HOUSING_ITEM_DEFS } from '../../data/housing';

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
 * Returns resource updates to apply.
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
 * Returns special resources updates to apply.
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
 * Produces output resources with rank bonus and housing action bonus applied.
 * Returns resource updates to apply.
 */
export function produceOutputs(
  state: GameState,
  definition: ActionDefinition,
  rankBonus: number
): ResourceUpdate {
  const updates: ResourceUpdate = {};

  // Get housing action bonuses
  const housingBonuses = getHousingBonuses(state, (id) => HOUSING_ITEM_DEFS[id]);

  // Calculate total action bonus (rank + housing)
  // Housing bonuses are stored per-skill or as 'all' (global)
  let totalActionBonus = rankBonus;

  // Add per-skill housing bonuses
  if (definition.skillXp) {
    for (const skillId of Object.keys(definition.skillXp)) {
      totalActionBonus += housingBonuses.actionBonus[skillId] || 0;
    }
  } else {
    // No skillXp, use global bonus
    totalActionBonus += housingBonuses.actionBonus['all'] || 0;
  }

  // Convert percentage to multiplier (e.g., 15% -> 0.15)
  const bonusMultiplier = 1 + (totalActionBonus / 100);

  for (const [resource, amount] of Object.entries(definition.outputs)) {
    const bonusAmount = amount * bonusMultiplier;

    // Handle stamina as a special resource
    if (resource === 'stamina') {
      const currentStamina = state.specialResources.stamina.current;
      const maxStamina = state.specialResources.stamina.max;
      const newStamina = Math.min(maxStamina, currentStamina + bonusAmount);
      updates.specialResources = {
        ...state.specialResources,
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
 * Returns game state updates to apply.
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
 * Updates action state after execution.
 * Returns updated action state.
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
