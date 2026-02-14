import { SPELL_DEFS } from '../../data/spells';
import { SpellItem } from './SpellItem';
import type { SpellState } from '../../types';

interface EquippedSpellsViewProps {
  spells: SpellState;
  onUnequip: (spellId: string) => void;
}

export function EquippedSpellsView({ spells, onUnequip }: EquippedSpellsViewProps) {
  const { equipped, cooldowns, slots } = spells;

  return (
    <div>
      <h3 className="text-sm text-gray-400 mb-3">
        Equipped Spells ({equipped.length} / {slots})
      </h3>
      <div className="flex flex-wrap gap-2">
        {equipped
          .filter((spellId) => SPELL_DEFS[spellId])
          .map((spellId) => (
            <SpellItem
              key={spellId}
              spell={SPELL_DEFS[spellId]}
              variant="equipped"
              cooldown={cooldowns[spellId] || 0}
              onUnequip={onUnequip}
            />
          ))}
        {Array.from({ length: slots - equipped.length }).map((_, index) => (
          <div
            key={`empty-${index}`}
            className="w-20 h-20 bg-gray-900 border border-dashed border-gray-700 rounded flex items-center justify-center text-gray-600 text-sm"
          >
            Empty
          </div>
        ))}
      </div>
    </div>
  );
}
