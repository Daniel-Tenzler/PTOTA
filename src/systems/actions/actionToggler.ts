import type { GameState } from '../../types';
import { ALL_ACTION_DEFS } from './actionRegistry';
import { isStudyAction } from './actionRegistry';

/**
 * Study action toggle system.
 * Handles toggle behavior for study actions.
 */

/**
 * Toggles a study action's active state.
 *
 * Study actions have special toggle behavior:
 * - Only one study action can be active at a time
 * - Activating a study action deactivates any other active study action
 * - Activating a study action deactivates any active non-study timed actions
 * - Clicking the same active study action toggles it off
 *
 * @param state - Current game state
 * @param actionId - ID of the study action to toggle
 * @returns Partial game state with updated action states
 */
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
