import type { GameState } from '../../types';

export interface GameCombatSlice {
  updateCombat: (updater: (state: GameState) => Partial<GameState>) => void;
}

export const createCombatSlice = (
  set: (partial: Partial<GameState>) => void,
  get: () => GameState
): GameCombatSlice => ({
  updateCombat: (updater) => {
    const state = get();
    const updates = updater(state);
    set({
      ...state,
      ...updates,
      combat: updates.combat ? { ...state.combat, ...updates.combat } : state.combat,
    });
  },
});
