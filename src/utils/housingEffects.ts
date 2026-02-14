import type { HousingItemDefinition } from '../types';

/**
 * Parsed effect value from a housing item.
 * Handles the "skillId:amount" string format for certain effect types.
 */
export interface ParsedEffectValue {
  skillId?: string;
  amount: number;
}

/**
 * Parses a housing item's value when it's in "skillId:amount" format.
 * @param value - The item value (string or number)
 * @returns Parsed effect with skillId and amount, or just amount if number
 */
export function parseEffectValue(value: string | number): ParsedEffectValue {
  if (typeof value === 'number') {
    return { amount: value };
  }

  // Value is a string at this point
  const parts = value.split(':');
  if (parts.length === 2) {
    const [skillId, amountStr] = parts;
    const amount = parseFloat(amountStr);
    if (!isNaN(amount)) {
      return { skillId, amount };
    }
  }

  // Fallback for string values that don't match expected format
  return { amount: 0 };
}

/**
 * Formats a housing item's effect as a human-readable string.
 * @param item - The housing item definition
 * @returns Formatted effect description
 */
export function formatEffectDescription(item: HousingItemDefinition): string {
  const { effect, value } = item;

  switch (effect) {
    case 'skillCap':
      if (typeof value === 'string') {
        const { skillId, amount } = parseEffectValue(value);
        return skillId ? `+${amount} ${skillId} skill cap` : 'Skill cap boost';
      }
      return 'Skill cap boost';

    case 'passiveGen':
      if (typeof value === 'string') {
        const { skillId, amount } = parseEffectValue(value);
        return skillId ? `+${amount}/sec` : 'Passive gen';
      }
      return 'Passive gen';

    case 'actionBonus':
      if (typeof value === 'string') {
        const { skillId, amount } = parseEffectValue(value);
        return skillId ? `+${amount}% ${skillId} action bonus` : `+${value}% action bonus`;
      }
      return `+${value}% action bonus`;

    case 'combatDamage':
      return `+${value} damage`;

    case 'healthRegen':
      return `+${value} health/sec`;

    case 'spellCooldown':
      return `-${value}% cooldown`;

    default:
      return 'Unknown effect';
  }
}
