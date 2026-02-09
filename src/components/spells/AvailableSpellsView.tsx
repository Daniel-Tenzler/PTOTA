import { SPELL_DEFS } from '../../data/spells';
import SpellItem from './SpellItem';
import type { SpellState } from '../../types';

interface AvailableSpellsViewProps {
  spells: SpellState;
  onEquip: (spellId: string) => void;
}

export function AvailableSpellsView({ spells, onEquip }: AvailableSpellsViewProps) {
  const { equipped, slots } = spells;
  const availableSpells = Object.values(SPELL_DEFS);

  return (
    <div>
      <h3 className="text-sm text-gray-400 mb-3">Available Spells</h3>
      <div className="grid gap-2">
        {availableSpells.map((spell) => {
          const isEquipped = equipped.includes(spell.id);
          const canEquip = !isEquipped && equipped.length < slots;

          return (
            <SpellItem
              key={spell.id}
              spell={spell}
              variant="available"
              isEquipped={isEquipped}
              canEquip={canEquip}
              onEquip={onEquip}
            />
          );
        })}
      </div>
    </div>
  );
}
