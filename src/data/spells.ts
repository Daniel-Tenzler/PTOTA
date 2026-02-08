import type { SpellDefinition } from '../types';

export const SPELL_DEFS: Record<string, SpellDefinition> = {
  'fireball': {
    id: 'fireball',
    name: 'Fireball',
    description: 'Deals 10 fire damage',
    cooldown: 5, // seconds
    effect: () => 10,
  },
  'ice-shard': {
    id: 'ice-shard',
    name: 'Ice Shard',
    description: 'Deals 7 ice damage',
    cooldown: 3,
    effect: () => 7,
  },
};
