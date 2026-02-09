import type { SpellState } from '../../types';

/**
 * Merge spells state, handling nested cooldowns object.
 *
 * @param base - The base spells state
 * @param updates - Partial updates to apply
 * @returns A new merged spells object
 */
export function mergeSpells(
  base: SpellState,
  updates?: Partial<SpellState>
): SpellState {
  if (!updates) return base;
  return {
    ...base,
    ...updates,
    cooldowns: { ...base.cooldowns, ...(updates.cooldowns || {}) },
  };
}

/**
 * Merge strategy for spells with accumulator pattern.
 * Handles deep merge for cooldowns dictionary.
 *
 * @param accumulator - Previously accumulated updates
 * @param newValue - New updates to apply
 * @param baseValue - Original base value for reference
 * @returns Merged spells state
 */
export function mergeSpellsProperty(
  accumulator: SpellState | undefined,
  newValue: Partial<SpellState>,
  baseValue: SpellState
): SpellState {
  const acc = accumulator || baseValue;
  return {
    slots: newValue.slots ?? acc.slots,
    equipped: newValue.equipped ?? acc.equipped,
    cooldowns: {
      ...acc.cooldowns,
      ...(newValue.cooldowns || {}),
    },
  };
}
