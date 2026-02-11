import type { ActionState } from '../../types';

/**
 * Action factory functions.
 * Provides factory methods to create action state objects.
 */

/**
 * Creates a new ActionState with default values.
 *
 * @param isUnlocked - Whether the action is initially unlocked (default: false)
 * @returns A new ActionState object
 */
export function createActionState(isUnlocked = false): ActionState {
  return {
    executionCount: 0,
    isUnlocked,
    isActive: false,
    lastExecution: 0,
  };
}
