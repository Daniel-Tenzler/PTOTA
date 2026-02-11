import type { GameState, ActionDefinition, ActionState } from '../../types';
import { executeUnlockAction as execUnlock } from '../unlockActions';
import { createActionState } from './actionFactory';
import {
  consumeInputs,
  consumeStamina,
  produceOutputs,
  awardActionSkillXp,
  updateActionState,
} from './actionProcessors';

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
  const actionState: ActionState = state.actions[actionId] || createActionState(true);

  const rankBonus = definition.rankBonus(actionState.executionCount);

  // Consume inputs
  Object.assign(updates, consumeInputs(state, definition));

  // Consume stamina
  Object.assign(updates, consumeStamina(state, definition));

  // Apply outputs with rank bonus
  Object.assign(updates, produceOutputs(state, definition, rankBonus));

  // Award skill XP
  Object.assign(updates, awardActionSkillXp(state, definition));

  // Update execution count
  updates.actions = {
    ...updates.actions,
    [actionId]: updateActionState(actionState),
  };

  return updates;
}
