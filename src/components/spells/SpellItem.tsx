import { useTooltip, spellRenderer } from '../tooltip';
import type { SpellDefinition } from '../../types';

type SpellItemVariant = 'equipped' | 'available';

interface SpellItemProps {
  spell: SpellDefinition;
  variant: SpellItemVariant;
  // Props for equipped variant
  index?: number;
  cooldown?: number;
  // Props for available variant
  isEquipped?: boolean;
  canEquip?: boolean;
  // Callbacks
  onUnequip?: (spellId: string) => void;
  onEquip?: (spellId: string) => void;
}

// Unified component for spell items to avoid duplication
function SpellItem({
  spell,
  variant,
  index,
  cooldown = 0,
  isEquipped = false,
  canEquip = false,
  onUnequip,
  onEquip,
}: SpellItemProps) {
  const { triggerProps, tooltipElement } = useTooltip(spellRenderer, {
    definition: spell,
    currentCooldown: cooldown,
  });

  const isEquippedVariant = variant === 'equipped';

  const baseClassName = 'p-3 rounded';
  const variantClassName = isEquippedVariant
    ? 'bg-gray-800 cursor-pointer hover:bg-gray-700'
    : isEquipped
      ? 'bg-gray-800'
      : canEquip
        ? 'bg-gray-900 cursor-pointer hover:bg-gray-800'
        : 'bg-gray-900 opacity-50';

  const handleClick = () => {
    if (isEquippedVariant && onUnequip) {
      onUnequip(spell.id);
    } else if (!isEquippedVariant && canEquip && onEquip) {
      onEquip(spell.id);
    }
  };

  return (
    <div>
      <div
        {...triggerProps}
        className={`${baseClassName} ${variantClassName}`}
        onClick={handleClick}
      >
        {isEquippedVariant ? (
          <>
            <div className="flex justify-between">
              <span className="text-gray-100">{spell.name}</span>
              <span className="text-gray-400">Slot {index! + 1}</span>
            </div>
            <p className="text-sm text-gray-500 mt-1">{spell.description}</p>
            {cooldown > 0 && (
              <div className="text-xs text-gray-600 mt-2">
                Cooldown: {parseFloat(cooldown.toFixed(1))}s
              </div>
            )}
            <div className="text-xs text-gray-600 mt-2">Click to unequip</div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
      {tooltipElement}
    </div>
  );
}

export default SpellItem;
