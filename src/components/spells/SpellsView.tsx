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

      <EquippedSpellsView spells={spells} onUnequip={unequipSpell} />
      <AvailableSpellsView spells={spells} onEquip={equipSpell} />
    </div>
  );
}
