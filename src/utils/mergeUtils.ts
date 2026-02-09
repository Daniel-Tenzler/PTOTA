/**
 * Merge utilities for GameState updates.
 *
 * This file re-exports all merge functions from focused modules
 * for backward compatibility.
 *
 * @module mergeUtils
 */

// Shallow merge
export { mergeShallow } from './merge/mergeShallow';

// Special resources merge
export {
  mergeSpecialResource,
  mergeSpecialResources,
} from './merge/mergeSpecialResources';

// Spells merge
export { mergeSpells } from './merge/mergeSpells';

// Main game state merge
export { mergeGameState } from './merge/mergeGameState';

// Update accumulator
export { accumulateUpdates } from './merge/accumulateUpdates';
