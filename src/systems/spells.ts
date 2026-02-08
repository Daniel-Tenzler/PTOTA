import type { GameState, CombatLogEntry } from '../types';
import { SPELL_DEFS } from '../data/spells';

function addLogEntry(log: CombatLogEntry[], entry: CombatLogEntry): CombatLogEntry[] {
  return [...log, entry].slice(-20); // Keep only last 20 entries
}

export function updateSpells(state: GameState, delta: number): Partial<GameState> {
  if (!state.combat.isActive || !state.combat.currentEnemy) return {};

  const updates: Partial<GameState> = {};
  const newCooldowns: Record<string, number> = { ...state.spells.cooldowns };
  const logEntries: CombatLogEntry[] = [];
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
        newCooldowns[spellId] = spell.cooldown;

        logEntries.push({
          type: 'spell-cast',
          message: `Cast ${spell.name} for ${damage} damage`,
          timestamp: Date.now(),
        });
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
