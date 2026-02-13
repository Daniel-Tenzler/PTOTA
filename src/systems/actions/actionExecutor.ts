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
import { accumulateUpdates } from '../../utils/merge/accumulateUpdates';

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

  const actionState: ActionState = state.actions[actionId] || createActionState(true);

  const rankBonus = definition.rankBonus(actionState.executionCount);

  // Accumulate all updates using proper merge utility
  let updates: Partial<GameState> = {};

  updates = accumulateUpdates(updates, consumeInputs(state, definition), state);
  updates = accumulateUpdates(updates, consumeStamina(state, definition), state);
  updates = accumulateUpdates(updates, produceOutputs(state, definition, rankBonus), state);
  updates = accumulateUpdates(updates, awardActionSkillXp(state, definition), state);

  // Update execution count
  updates.actions = {
    ...updates.actions,
    [actionId]: updateActionState(actionState),
  };

  return updates;
}
