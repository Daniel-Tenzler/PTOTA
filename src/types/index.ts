/**
 * Main type definitions export.
 * Re-exports all domain-specific types and provides the central GameState interface.
 */

// Resource types
export type { Resources, SpecialResource, SpecialResources } from './resources';

// Action types
export type { ActionCategory, ActionDefinition, ActionState } from './actions';

// Skill types
export type { SkillBonusValue, SkillBonus, SkillDefinition, SkillState } from './skills';

// Spell types
export type { SpellDefinition, SpellState } from './spells';

// Combat types
export type { CombatLogEntry, Enemy, CombatState, DungeonDefinition } from './combat';

// Import types for use in GameState interface
import type { Resources, SpecialResources } from './resources';
import type { ActionState } from './actions';
import type { SkillState } from './skills';
import type { SpellState } from './spells';
import type { CombatState } from './combat';

/**
 * Main game state.
 * Combines all domain-specific states into a single interface.
 */
export interface GameState {
  resources: Resources;
  specialResources: SpecialResources;
  actions: { [actionId: string]: ActionState };
  skills: { [skillId: string]: SkillState };
  spells: SpellState;
  combat: CombatState;
  dungeons: {
    unlocked: string[];
    selected: string | null;
  };
  lastUpdate: number;
  activeTab: 'actions' | 'skills' | 'spells' | 'combat';
}
