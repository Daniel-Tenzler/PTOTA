/**
 * Spell-related type definitions.
 */

import type { GameState } from './index';

export interface SpellDefinition {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  effect: (state: GameState) => number;
  icon?: string;
}

export interface SpellState {
  slots: number;
  equipped: string[];
  cooldowns: { [spellId: string]: number };
}
