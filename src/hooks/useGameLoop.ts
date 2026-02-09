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
      // Merge specialResources from timed actions with existing specialResources
      if (actionUpdates.specialResources) {
        updates.specialResources = {
          ...(updates.specialResources || state.specialResources),
          ...actionUpdates.specialResources,
        };
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
      if (combatUpdates.combat) {
        updates.combat = { ...state.combat, ...combatUpdates.combat };
      }
      if (combatUpdates.resources) {
        updates.resources = { ...updates.resources, ...combatUpdates.resources };
      }
      if (combatUpdates.specialResources) {
        updates.specialResources = {
          ...(updates.specialResources || state.specialResources),
          ...combatUpdates.specialResources,
        };
      }

      // Spells
      const spellUpdates = updateSpells(state, delta);
      if (spellUpdates.combat) {
        updates.combat = { ...(updates.combat || state.combat), ...spellUpdates.combat };
      }
      if (spellUpdates.spells) {
        updates.spells = { ...state.spells, ...spellUpdates.spells };
      }

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
