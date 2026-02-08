import { useEffect, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';
import { updateSpecialResources } from '../systems/resources';
import { checkSkillLevelUps } from '../systems/skills';
import { updateCombat } from '../systems/combat';
import { updateSpells } from '../systems/spells';
import { updateTimedActions } from '../systems/timedActions';
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

      // Collect all updates
      const updates: Partial<GameState> = {
        lastUpdate: currentTime,
      };

      // Resources
      const resourceUpdates = updateSpecialResources(state, delta);
      Object.assign(updates, resourceUpdates);

      // Timed actions
      const actionUpdates = updateTimedActions(state, delta);
      if (actionUpdates.actions) {
        updates.actions = { ...state.actions, ...actionUpdates.actions };
      }
      if (actionUpdates.resources) {
        updates.resources = { ...state.resources, ...actionUpdates.resources };
      }
      if (actionUpdates.skills) {
        updates.skills = { ...state.skills, ...actionUpdates.skills };
      }

      // Skills
      const skillUpdates = checkSkillLevelUps(state);
      if (skillUpdates.skills) {
        updates.skills = { ...updates.skills || state.skills, ...skillUpdates.skills };
      }
      if (skillUpdates.actions) {
        updates.actions = { ...updates.actions || state.actions, ...skillUpdates.actions };
      }

      // Combat
      const combatUpdates = updateCombat(state, delta);
      Object.assign(updates, combatUpdates);

      // Spells
      const spellUpdates = updateSpells(state, delta);
      Object.assign(updates, spellUpdates);

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
