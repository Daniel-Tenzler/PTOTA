import type { GameState } from '../../types';

export interface GameSpellsSlice {
  equipSpell: (spellId: string) => void;
  unequipSpell: (spellId: string) => void;
  setActiveTab: (tab: 'actions' | 'skills' | 'spells' | 'combat') => void;
}

export const createSpellsSlice = (
  set: (partial: Partial<GameState>) => void,
  get: () => GameState
): GameSpellsSlice => ({
  equipSpell: (spellId: string) => {
    const state = get();
    if (state.spells.equipped.includes(spellId)) return;
    if (state.spells.equipped.length >= state.spells.slots) return;

    set({
      spells: {
        ...state.spells,
        equipped: [...state.spells.equipped, spellId],
      },
    });
  },

  unequipSpell: (spellId: string) => {
    const state = get();
    set({
      spells: {
        ...state.spells,
        equipped: state.spells.equipped.filter((id: string) => id !== spellId),
        cooldowns: {
          ...state.spells.cooldowns,
          [spellId]: 0,
        },
      },
    });
  },

  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },
});
