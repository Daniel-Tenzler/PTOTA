import type { HousingState, Resources } from '../../types';
import { useGameStore } from '../../stores/gameStore';
import { HOUSING_ITEM_DEFS } from '../../data/housing';
import { canAffordItem } from '../../systems/housing';
import type { GameState } from '../../types';
import { useTooltip } from '../tooltip/index';

interface ItemsCatalogProps {
  housing: HousingState;
  resources: Resources;
}

// Item tooltip data interface
interface ItemTooltipData {
  name: string;
  description: string;
  space: number;
  effectString: string;
  cost: Record<string, number>;
  equipped: boolean;
}

// Item tooltip renderer
function itemTooltipRenderer({ name, description, space, effectString, cost, equipped }: ItemTooltipData) {
  return (
    <div className="max-w-xs">
      <div className="font-semibold mb-1">{name}</div>
      <div className="text-sm text-gray-400 mb-2">{description}</div>
      <div className="text-xs text-gray-500">
        <div className="mb-1">{space} space</div>
        <div className="mb-1">{effectString}</div>
        {!equipped && cost && Object.keys(cost).length > 0 && (
          <div>
            Cost:
            {Object.entries(cost).map(([resource, amount]) => (
              <div key={resource} className="text-sm mt-1">
                {amount} {resource}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ItemCard({
  item,
  equipped,
  owned,
  canAfford,
  onEquip,
  onUnequip,
}: {
  item: {
    id: string;
    name: string;
    space: number;
    cost: Record<string, number>;
    description: string;
    effect: string;
    value: number | string;
    requiresUnlock?: boolean;
  };
  equipped: boolean;
  owned: boolean;
  canAfford: boolean;
  onEquip: () => void;
  onUnequip: () => void;
}) {
  const effectString = (() => {
    switch (item.effect) {
      case 'skillCap':
        if (typeof item.value === 'string') {
          const parts = item.value.split(':');
          return parts.length === 2 ? `+${parts[1]} skill cap` : 'Skill cap boost';
        }
        return 'Skill cap boost';
      case 'passiveGen':
        if (typeof item.value === 'string') {
          const parts = item.value.split(':');
          return parts.length === 2 ? `+${parts[1]}/sec` : 'Passive gen';
        }
        return 'Passive gen';
      case 'actionBonus':
        if (typeof item.value === 'string') {
          const parts = item.value.split(':');
          return parts.length === 2 ? `+${parts[1]}% ${parts[0]} action bonus` : `+${item.value}% action bonus`;
        }
        return `+${item.value}% action bonus`;
      case 'combatDamage':
        return `+${item.value} damage`;
      case 'healthRegen':
        return `+${item.value} health/sec`;
      case 'spellCooldown':
        return `-${item.value}% cooldown`;
      default:
        return 'Unknown effect';
    }
  })();

  const tooltipData = {
    name: item.name,
    description: item.description,
    space: item.space,
    effectString,
    cost: item.cost,
    equipped,
  };

  const { triggerProps, tooltipElement } = useTooltip(
    itemTooltipRenderer,
    tooltipData
  );

  return (
    <div {...triggerProps} className={`bg-gray-800 rounded p-4 ${
      equipped ? 'ring-2 ring-blue-500' : ''
    }`}>
      {tooltipElement}
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium">{item.name}</h3>
        <span className="text-sm bg-gray-700 px-2 py-1 rounded">
          {item.space} space
        </span>
      </div>
      {equipped ? (
        <button
          onClick={onUnequip}
          className="w-full py-2 px-4 rounded bg-red-600 hover:bg-red-700 text-white transition-colors"
        >
          Unequip
        </button>
      ) : owned ? (
        <button
          onClick={onEquip}
          disabled={!canAfford}
          className={`w-full py-2 px-4 rounded transition-colors ${
            canAfford
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          Equip
        </button>
      ) : (
        <div className="text-sm text-gray-500">Requires unlock</div>
      )}
    </div>
  );
}

export function ItemsCatalog({ housing }: ItemsCatalogProps) {
  const equipItem = useGameStore((s) => s.equipItem);
  const unequipItemById = useGameStore((s) => s.unequipItemById);
  const state = useGameStore((s) => s) as GameState;

  // For now, we'll allow equipping to any owned house
  // In practice, you'd select which house to equip to
  const getHouseToEquipTo = () => {
    // Use the most recently purchased house
    return housing.ownedHouses[housing.ownedHouses.length - 1] || 'shelter';
  };

  // Create a flat map of all equipped items across all houses
  const allEquippedItems = new Set<string>();
  Object.values(housing.equippedItems).forEach((items) => {
    items.forEach((itemId) => allEquippedItems.add(itemId));
  });

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Items</h2>
      <div className="grid grid-cols-3 gap-4">
        {Object.values(HOUSING_ITEM_DEFS)
          .filter((item) => {
            // Show item if it doesn't require unlock OR if it's unlocked
            return !item.requiresUnlock || housing.unlockedItems.includes(item.id);
          })
          .map((item) => {
            const equipped = allEquippedItems.has(item.id);
            const canAfford = !equipped && canAffordItem(state, item);
            const unlocked = !item.requiresUnlock || housing.unlockedItems.includes(item.id);

            return (
              <ItemCard
                key={item.id}
                item={item}
                equipped={equipped}
                owned={unlocked}
                canAfford={canAfford}
                onEquip={() => equipItem(getHouseToEquipTo(), item.id)}
                onUnequip={() => unequipItemById(item.id)}
              />
            );
          })}
      </div>
    </div>
  );
}
