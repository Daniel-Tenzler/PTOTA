import { useGameStore } from '../../stores/gameStore';
import { SPELL_DEFS } from '../../data/spells';

export function SpellsView() {
  const spells = useGameStore((s) => s.spells);
  const equipped = useGameStore((s) => s.spells.equipped);
  const cooldowns = useGameStore((s) => s.spells.cooldowns);
  const equipSpell = useGameStore((s) => s.equipSpell);
  const unequipSpell = useGameStore((s) => s.unequipSpell);

  const availableSpells = Object.values(SPELL_DEFS);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-100 mb-6">Spells</h2>

      <div className="mb-6">
        <h3 className="text-sm text-gray-400 mb-3">
          Spell Slots: {equipped.length} / {spells.slots}
        </h3>
        <div className="grid gap-2">
          {equipped.map((spellId, index) => {
            const spell = SPELL_DEFS[spellId];
            const cooldown = cooldowns[spellId] || 0;
            if (!spell) return null;

            return (
              <div
                key={spellId}
                className="bg-gray-800 p-3 rounded cursor-pointer hover:bg-gray-700"
                onClick={() => unequipSpell(spellId)}
                title="Click to unequip"
              >
                <div className="flex justify-between">
                  <span className="text-gray-100">{spell.name}</span>
                  <span className="text-gray-400">Slot {index + 1}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{spell.description}</p>
                {cooldown > 0 && (
                  <div className="text-xs text-gray-600 mt-2">
                    Cooldown: {cooldown.toFixed(1)}s
                  </div>
                )}
                <div className="text-xs text-gray-600 mt-2">Click to unequip</div>
              </div>
            );
          })}
          {equipped.length < spells.slots && (
            <div className="bg-gray-900 border border-dashed border-gray-700 p-3 rounded text-center text-gray-600">
              Empty slot
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-sm text-gray-400 mb-3">Available Spells</h3>
        <div className="grid gap-2">
          {availableSpells.map((spell) => {
            const isEquipped = equipped.includes(spell.id);
            const canEquip = !isEquipped && equipped.length < spells.slots;

            return (
              <div
                key={spell.id}
                className={`p-3 rounded ${
                  isEquipped
                    ? 'bg-gray-800'
                    : canEquip
                      ? 'bg-gray-900 cursor-pointer hover:bg-gray-800'
                      : 'bg-gray-900 opacity-50'
                }`}
                onClick={() => canEquip && equipSpell(spell.id)}
                title={canEquip ? 'Click to equip' : isEquipped ? 'Already equipped' : 'No available slots'}
              >
                <div className="text-gray-100">{spell.name}</div>
                <div className="text-sm text-gray-500">{spell.description}</div>
                <div className="text-xs text-gray-600 mt-1">
                  Cooldown: {spell.cooldown}s
                </div>
                {canEquip && (
                  <div className="text-xs text-gray-500 mt-2">Click to equip</div>
                )}
                {isEquipped && (
                  <div className="text-xs text-gray-600 mt-2">Equipped</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
