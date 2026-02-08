import { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { saveGame } from '../stores/saveStore';

const AUTO_SAVE_INTERVAL = 30000; // 30 seconds

export function useSave() {
  const state = useGameStore();

  useEffect(() => {
    const interval = setInterval(() => {
      saveGame(state);
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [state]);

  // Save on unmount
  useEffect(() => {
    return () => {
      saveGame(state);
    };
  }, [state]);
}
