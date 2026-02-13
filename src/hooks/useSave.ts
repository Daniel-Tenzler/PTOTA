import { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { saveGame } from '../stores/saveStore';

const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export function useSave() {
  useEffect(() => {
    const interval = setInterval(() => {
      saveGame(useGameStore.getState());
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  // Save on unmount
  useEffect(() => {
    return () => {
      saveGame(useGameStore.getState());
    };
  }, []);
}
