import type { ActionDefinition } from '../../types';
import { ACTION_DEFS, STUDY_ACTIONS } from '../../data/actions';
import { UNLOCK_ACTION_DEFS } from '../../data/unlockActions';
import { TIMED_ACTION_DEFS } from '../../data/timedActions';

/**
 * Action registry and definitions.
 * Provides merged action definitions and helper functions.
 */

/**
 * Merged registry of all action definitions.
 * Combines standard actions, unlock actions, timed actions, and study actions.
 */
export const ALL_ACTION_DEFS: Record<string, ActionDefinition> = {
  ...ACTION_DEFS,
  ...UNLOCK_ACTION_DEFS,
  ...TIMED_ACTION_DEFS,
  ...STUDY_ACTIONS,
};

/**
 * Helper function to check if an action is a study action.
 * Study actions are identified by the 'study-' prefix in their ID.
 *
 * @param actionId - The ID of the action to check
 * @returns True if the action is a study action, false otherwise
 */
export function isStudyAction(actionId: string): boolean {
  return actionId.startsWith('study-');
}
