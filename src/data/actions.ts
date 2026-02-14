import type { ActionDefinition } from '../types';
import { standardRankBonus } from '../utils/rankBonus';
import { createResourceAction, createTimedAction, createStudyAction, STUDY_ACTION_DISPLAY_NAMES, STUDY_ACTIONS } from './actions/factories';
import { RESOURCE_ACTIONS } from './actions/resourceActions';
import { HOUSING_UNLOCK_ACTIONS } from './actions/housingUnlockActions';

// Re-export factory functions for external use
export { createResourceAction, createTimedAction, createStudyAction, STUDY_ACTION_DISPLAY_NAMES, STUDY_ACTIONS };
export type { ActionDefinition };

/**
 * All base action definitions.
 * Apply rankBonus function to each resource action.
 */
export const ACTION_DEFS: Record<string, ActionDefinition> = Object.fromEntries([
  ...RESOURCE_ACTIONS.map(action => [action.id, { ...action, rankBonus: standardRankBonus }]),
  ...HOUSING_UNLOCK_ACTIONS.map(action => [action.id, action]),
]);
