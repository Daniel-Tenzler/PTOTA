import type { GameState } from '../../types';
import { mergeGameState } from '../../utils/mergeUtils';
import { ALL_ACTION_DEFS, canExecuteAction, executeAction as executeActionSystem } from '../../systems/actions';
import { toggleTimedAction as toggleTimedActionSystem } from '../../systems/timedActions';
import { toggleStudyAction as toggleStudyActionSystem } from '../../systems/actions';

export interface GameActionsSlice {
  executeAction: (actionId: string) => void;
  toggleTimedAction: (actionId: string) => void;
  toggleStudyAction: (actionId: string) => void;
}

export const createActionsSlice = (
  set: (partial: Partial<GameState>) => void,
  get: () => GameState
): GameActionsSlice => ({
  executeAction: (actionId: string) => {
    const state = get();
    const definition = ALL_ACTION_DEFS[actionId];
    if (!definition) return;

    if (canExecuteAction(state, actionId, definition)) {
      const updates = executeActionSystem(state, actionId, definition);
      set(mergeGameState(state, updates));
    }
  },

  toggleTimedAction: (actionId: string) => {
    const state = get();
    const updates = toggleTimedActionSystem(state, actionId);
    set(mergeGameState(state, updates));
  },

  toggleStudyAction: (actionId: string) => {
    const state = get();
    const updates = toggleStudyActionSystem(state, actionId);
    set(mergeGameState(state, updates));
  },
});
