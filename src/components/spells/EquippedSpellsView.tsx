import { SPELL_DEFS } from '../../data/spells';
import SpellItem from './SpellItem';
import type { SpellState } from '../../types';

interface EquippedSpellsViewProps {
  spells: SpellState;
  onUnequip: (spellId: string) => void;
}

export function EquippedSpellsView({ spells, onUnequip }: EquippedSpellsViewProps) {
  const { equipped, cooldowns, slots } = spells;

  return (
    <div className="mb-6">
      <h3 className="text-sm text-gray-400 mb-3">
        Spell Slots: {equipped.length} / {slots}
      </h3>
      <div className="grid gap-2">
        {equipped
          .filter((spellId) => SPELL_DEFS[spellId])
          .map((spellId, index) => (
            <SpellItem
              key={spellId}
              spell={SPELL_DEFS[spellId]}
              variant="equipped"
              index={index}
              cooldown={cooldowns[spellId] || 0}
              onUnequip={onUnequip}
            />
          ))}
        {equipped.length < slots && (
          <div className="bg-gray-900 border border-dashed border-gray-700 p-3 rounded text-center text-gray-600">
            Empty slot
          </div>
        )}
      </div>
    </div>
  );
}
