import { GameState } from '../types';

const SAVE_KEY = 'theoryOfTheArcane_save';

export function saveGame(state: GameState): void {
  try {
    const saveData = JSON.stringify(state);
    localStorage.setItem(SAVE_KEY, saveData);
  } catch (error) {
    console.error('Save failed:', error);
  }
}

export function loadGame(): GameState | null {
  try {
    const saveData = localStorage.getItem(SAVE_KEY);
    if (!saveData) return null;
    return JSON.parse(saveData) as GameState;
  } catch (error) {
    console.error('Load failed:', error);
    return null;
  }
}

export function clearSave(): void {
  localStorage.removeItem(SAVE_KEY);
}

export function hasSave(): boolean {
  return localStorage.getItem(SAVE_KEY) !== null;
}
