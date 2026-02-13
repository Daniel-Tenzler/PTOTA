import type { GameState } from '../types';
import { SPELL_DEFS } from '../data/spells';
import { addLogEntry, createSpellCastEntry } from './combat/combatLogger';
import { getHousingBonuses } from './housing';
import { HOUSING_ITEM_DEFS } from '../data/housing';

export function updateSpells(state: GameState, delta: number): Partial<GameState> {
  if (!state.combat.isActive || !state.combat.currentEnemy) return {};

  // Get housing bonuses for spell cooldown reduction
  const housingBonuses = getHousingBonuses(state, (id) => HOUSING_ITEM_DEFS[id]);
  const cooldownReduction = housingBonuses.spellCooldown / 100; // Convert percentage to decimal

  const updates: Partial<GameState> = {};
  const newCooldowns: Record<string, number> = { ...state.spells.cooldowns };
  const logEntries: ReturnType<typeof createSpellCastEntry>[] = [];
  let currentEnemy = state.combat.currentEnemy;

  // Reduce cooldowns and auto-cast
  for (const spellId of state.spells.equipped) {
    const currentCooldown = state.spells.cooldowns[spellId] || 0;
    if (currentCooldown > 0) {
      newCooldowns[spellId] = Math.max(0, currentCooldown - delta);
    } else if (currentEnemy.health > 0) {
      // Spell is ready - cast it
      const spell = SPELL_DEFS[spellId];
      if (spell) {
        const damage = spell.effect(state);
        currentEnemy = { ...currentEnemy, health: Math.max(0, currentEnemy.health - damage) };

        // Apply housing cooldown reduction
        const reducedCooldown = spell.cooldown * (1 - cooldownReduction);
        newCooldowns[spellId] = Math.max(0, reducedCooldown);

        logEntries.push(createSpellCastEntry(spell.name, damage));
      }
    }
  }

  if (logEntries.length > 0) {
    let newLog = state.combat.log;
    for (const entry of logEntries) {
      newLog = addLogEntry(newLog, entry);
    }
    updates.combat = {
      ...state.combat,
      currentEnemy,
      log: newLog,
    };
  }

  updates.spells = {
    ...state.spells,
    cooldowns: newCooldowns,
  };

  return updates;
}

export function castSpell(state: GameState, spellId: string): Partial<GameState> {
  const spell = SPELL_DEFS[spellId];
  if (!spell) return {};

  const updates: Partial<GameState> = {};
  const damage = spell.effect(state);

  // Deal damage to enemy
  if (state.combat.currentEnemy) {
    updates.combat = {
      ...state.combat,
      currentEnemy: {
        ...state.combat.currentEnemy,
        health: state.combat.currentEnemy.health - damage,
      },
    };
  }

  // Set cooldown
  updates.spells = {
    ...state.spells,
    cooldowns: {
      ...state.spells.cooldowns,
      [spellId]: spell.cooldown,
    },
  };

  return updates;
}

export function canCastSpell(state: GameState, spellId: string): boolean {
  const cooldown = state.spells.cooldowns[spellId] || 0;
  return cooldown <= 0 && state.combat.isActive;
}
