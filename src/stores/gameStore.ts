import { create } from 'zustand';
import type { GameState } from '../types';
import { loadGame } from './saveStore';
import { mergeGameState } from '../utils/mergeUtils';
import { createActionsSlice, type GameActionsSlice } from './slices/gameActionsSlice';
import { createCombatSlice, type GameCombatSlice } from './slices/gameCombatSlice';
import { createSpellsSlice, type GameSpellsSlice } from './slices/gameSpellsSlice';
import { createHousingSlice, type GameHousingSlice } from './slices/gameHousingSlice';
import { DEFAULT_STATE } from '../config/initialState';

const SAVED_STATE = loadGame();

const INITIAL_STATE: GameState = SAVED_STATE
  ? mergeGameState(DEFAULT_STATE, SAVED_STATE)
  : DEFAULT_STATE;

interface GameStore extends GameState, GameActionsSlice, GameCombatSlice, GameSpellsSlice, GameHousingSlice {
  update: (delta: number, timestamp: number) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...INITIAL_STATE,

  // Game loop update method
  update: (_delta: number, _timestamp: number) => {
    // Will be populated by game loop later
  },

  // Combine all slices
  ...createActionsSlice(set, get),
  ...createCombatSlice(set, get),
  ...createSpellsSlice(set, get),
  ...createHousingSlice(set, get),
}));
