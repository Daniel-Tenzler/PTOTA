import type { GameState } from '../types';
import { ALL_ACTION_DEFS } from './actions';
import { canExecuteAction, executeAction } from './actions';

export function updateTimedActions(state: GameState, _delta: number): Partial<GameState> {
  const updates: Partial<GameState> = {};
  const now = Date.now();

  for (const [actionId, actionState] of Object.entries(state.actions)) {
    const definition = ALL_ACTION_DEFS[actionId];
    if (!definition || definition.category !== 'timed') continue;
    if (!actionState.isActive) continue;

    // Check if it's time to execute
    const timeSinceLastExecution = (now - actionState.lastExecution) / 1000;
    if (timeSinceLastExecution >= (definition.duration || 1)) {
      // Try to execute
      if (canExecuteAction(state, actionId, definition)) {
        const executionUpdates = executeAction(state, actionId, definition);
        updates.actions = { ...updates.actions, ...executionUpdates.actions };
        updates.resources = { ...updates.resources, ...executionUpdates.resources };
        updates.skills = { ...updates.skills, ...executionUpdates.skills };
      } else {
        // Can't execute anymore - deactivate
        updates.actions = {
          ...updates.actions,
          [actionId]: { ...actionState, isActive: false },
        };
      }
    }
  }

  return updates;
}

export function toggleTimedAction(state: GameState, actionId: string): Partial<GameState> {
  const actionState = state.actions[actionId];
  if (!actionState) return {};

  const newState = !actionState.isActive;
  return {
    actions: {
      ...state.actions,
      [actionId]: {
        ...actionState,
        isActive: newState,
        lastExecution: newState ? Date.now() : actionState.lastExecution,
      },
    },
  };
}
