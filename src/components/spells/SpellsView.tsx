import { useGameStore } from '../../stores/gameStore';
import { EquippedSpellsView } from './EquippedSpellsView';
import { AvailableSpellsView } from './AvailableSpellsView';

export function SpellsView() {
  const spells = useGameStore((s) => s.spells);
  const equipSpell = useGameStore((s) => s.equipSpell);
  const unequipSpell = useGameStore((s) => s.unequipSpell);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-100 mb-6">Spells</h2>

      <div className="flex gap-6">
        <div className="flex-1">
          <AvailableSpellsView spells={spells} onEquip={equipSpell} />
        </div>
        <div className="border-l border-gray-700" />
        <div className="flex-1">
          <EquippedSpellsView spells={spells} onUnequip={unequipSpell} />
        </div>
      </div>
    </div>
  );
}
