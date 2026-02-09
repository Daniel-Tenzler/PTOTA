import { useEffect, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';
import { updateSpecialResources } from '../systems/resources';
import { checkSkillLevelUps } from '../systems/skills';
import { updateCombat } from '../systems/combat';
import { updateSpells } from '../systems/spells';
import { updateTimedActions } from '../systems/timedActions';
import { accumulateUpdates } from '../utils/mergeUtils';
import type { GameState } from '../types';

export function useGameLoop() {
  const frameRef = useRef<number>();

  useEffect(() => {
    let lastTime = performance.now();

    const tick = (currentTime: number) => {
      const delta = Math.min((currentTime - lastTime) / 1000, 0.5); // Cap at 0.5s
      lastTime = currentTime;

      // Get current state
      const state = useGameStore.getState();

      // Collect all updates using accumulateUpdates
      let updates: Partial<GameState> = { lastUpdate: currentTime };

      // Resources
      updates = accumulateUpdates(updates, updateSpecialResources(state, delta), state);

      // Timed actions
      updates = accumulateUpdates(updates, updateTimedActions(state, delta), state);

      // Skills
      updates = accumulateUpdates(updates, checkSkillLevelUps(state), state);

      // Combat
      updates = accumulateUpdates(updates, updateCombat(state, delta), state);

      // Spells
      updates = accumulateUpdates(updates, updateSpells(state, delta), state);

      // Apply all updates at once
      useGameStore.setState(updates);

      frameRef.current = requestAnimationFrame(tick);
    };

    frameRef.current = requestAnimationFrame(tick);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);
}
