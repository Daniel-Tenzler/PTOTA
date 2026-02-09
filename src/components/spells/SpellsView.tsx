import { useGameStore } from '../../stores/gameStore';
import { SPELL_DEFS } from '../../data/spells';
import { useTooltip, spellRenderer } from '../tooltip';
import type { SpellDefinition } from '../../types';

// Separate component for equipped spell item to avoid hooks-in-loop issue
function EquippedSpellItem({
  spellId,
  index,
  cooldown,
  onUnequip,
}: {
  spellId: string;
  index: number;
  cooldown: number;
  onUnequip: (spellId: string) => void;
}) {
  const spell = SPELL_DEFS[spellId];
  if (!spell) return null;

  const { triggerProps, tooltipElement } = useTooltip(spellRenderer, {
    definition: spell,
    currentCooldown: cooldown,
  });

  return (
    <div>
      <div
        {...triggerProps}
        className="bg-gray-800 p-3 rounded cursor-pointer hover:bg-gray-700"
        onClick={() => onUnequip(spellId)}
      >
        <div className="flex justify-between">
          <span className="text-gray-100">{spell.name}</span>
          <span className="text-gray-400">Slot {index + 1}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">{spell.description}</p>
        {cooldown > 0 && (
          <div className="text-xs text-gray-600 mt-2">
            Cooldown: {parseFloat(cooldown.toFixed(1))}s
          </div>
        )}
        <div className="text-xs text-gray-600 mt-2">Click to unequip</div>
      </div>
      {tooltipElement}
    </div>
  );
}

// Separate component for available spell item to avoid hooks-in-loop issue
function AvailableSpellItem({
  spell,
  isEquipped,
  canEquip,
  onEquip,
}: {
  spell: SpellDefinition;
  isEquipped: boolean;
  canEquip: boolean;
  onEquip: (spellId: string) => void;
}) {
  const { triggerProps, tooltipElement } = useTooltip(spellRenderer, {
    definition: spell,
    currentCooldown: 0,
  });

  return (
    <div>
      <div
        {...triggerProps}
        className={`p-3 rounded ${
          isEquipped
            ? 'bg-gray-800'
            : canEquip
              ? 'bg-gray-900 cursor-pointer hover:bg-gray-800'
              : 'bg-gray-900 opacity-50'
        }`}
        onClick={() => canEquip && onEquip(spell.id)}
      >
        <div className="text-gray-100">{spell.name}</div>
        <div className="text-sm text-gray-500">{spell.description}</div>
        <div className="text-xs text-gray-600 mt-1">Cooldown: {spell.cooldown}s</div>
        {canEquip && (
          <div className="text-xs text-gray-500 mt-2">Click to equip</div>
        )}
        {isEquipped && (
          <div className="text-xs text-gray-600 mt-2">Equipped</div>
        )}
      </div>
      {tooltipElement}
    </div>
  );
}

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
          {equipped
            .filter((spellId) => SPELL_DEFS[spellId])
            .map((spellId, index) => (
              <EquippedSpellItem
                key={spellId}
                spellId={spellId}
                index={index}
                cooldown={cooldowns[spellId] || 0}
                onUnequip={unequipSpell}
              />
            ))}
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
              <AvailableSpellItem
                key={spell.id}
                spell={spell}
                isEquipped={isEquipped}
                canEquip={canEquip}
                onEquip={equipSpell}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
