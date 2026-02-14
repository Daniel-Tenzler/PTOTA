import { useTooltip, spellRenderer } from '../tooltip';
import { ICON_MAP } from '../../constants/icons';
import { Sparkles } from 'lucide-react';
import type { SpellDefinition } from '../../types';

type SpellItemVariant = 'equipped' | 'available';

interface SpellItemProps {
  spell: SpellDefinition;
  variant: SpellItemVariant;
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
  const SpellIcon = spell.icon ? ICON_MAP[spell.icon] : Sparkles;

  const handleClick = () => {
    if (isEquippedVariant && onUnequip) {
      onUnequip(spell.id);
    } else if (!isEquippedVariant && canEquip && onEquip) {
      onEquip(spell.id);
    }
  };

  if (isEquippedVariant) {
    return (
      <div>
        <div
          {...triggerProps}
          className="w-20 h-20 bg-gray-800 rounded flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-gray-700 transition-colors"
          onClick={handleClick}
        >
          <SpellIcon className="w-6 h-6 text-orange-400" />
          <div className="text-xs text-gray-300 text-center px-1 truncate w-full">
            {spell.name}
          </div>
          {cooldown > 0 ? (
            <div className="text-xs text-gray-500">
              {cooldown.toFixed(1)}s
            </div>
          ) : (
            <div className="text-xs text-green-400">Ready</div>
          )}
        </div>
        {tooltipElement}
      </div>
    );
  }

  const baseClassName = 'p-3 rounded';
  const variantClassName = isEquipped
    ? 'bg-gray-800'
    : canEquip
      ? 'bg-gray-900 cursor-pointer hover:bg-gray-800'
      : 'bg-gray-900 opacity-50';

  return (
    <div>
      <div
        {...triggerProps}
        className={`${baseClassName} ${variantClassName}`}
        onClick={handleClick}
      >
        <div className="flex items-center gap-2 mb-2">
          <SpellIcon className="w-4 h-4 text-orange-400" />
          <div className="text-gray-100">{spell.name}</div>
        </div>
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
      {tooltipElement}
    </div>
  );
}

export { SpellItem };
