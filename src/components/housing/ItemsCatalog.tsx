import type { HousingState, Resources, HousingItemDefinition } from '../../types';
import { useGameStore } from '../../stores/gameStore';
import { HOUSING_ITEM_DEFS } from '../../data/housing';
import { canAffordItem } from '../../systems/housing';
import type { GameState } from '../../types';
import { useTooltip } from '../tooltip/index';
import { CATEGORY_ICONS, CATEGORY_COLORS } from './housingIcons';
import type { ItemCategory } from './housingIcons';
import { useMemo } from 'react';
import { ItemCategoryGroup } from './ItemCategoryGroup';
import { genericTooltipRenderer, formatItemTooltipData } from '../tooltip/GenericTooltip';
import { formatEffectDescription } from '../../utils/housingEffects';

interface ItemsCatalogProps {
  housing: HousingState;
  resources: Resources;
}

export function ItemRow({
  item,
  equipped,
  unlocked,
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
  unlocked: boolean;
  canAfford: boolean;
  onEquip: () => void;
  onUnequip: () => void;
}) {
  const effectString = formatEffectDescription(item as HousingItemDefinition);
  const tooltipData = formatItemTooltipData(
    item.name,
    item.description,
    item.space,
    effectString,
    item.cost
  );
  const { triggerProps, tooltipElement } = useTooltip(
    genericTooltipRenderer,
    tooltipData
  );

  const effectCategory = item.effect as ItemCategory;
  const ItemIcon = CATEGORY_ICONS[effectCategory];
  const colorClass = CATEGORY_COLORS[effectCategory];

  return (
    <div
      {...triggerProps}
      className={`flex items-center gap-3 p-2 rounded hover:bg-gray-700/50 border-b border-gray-700 last:border-b-0 ${
        equipped ? 'bg-blue-900/20' : ''
      }`}
    >
      <ItemIcon className={`w-4 h-4 ${colorClass} flex-shrink-0`} aria-label={`${item.name} icon`} />
      <div className="flex-1 min-w-0">
        <span className="font-medium truncate">{item.name}</span>
        <span className="text-gray-400 text-sm ml-2">· {item.space} space</span>
      </div>
      {tooltipElement}
      {equipped ? (
        <button
          onClick={onUnequip}
          className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-sm transition-colors flex-shrink-0"
        >
          Unequip
        </button>
      ) : unlocked ? (
        <button
          onClick={onEquip}
          disabled={!canAfford}
          className={`px-3 py-1 rounded text-sm transition-colors flex-shrink-0 ${
            canAfford
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          Equip
        </button>
      ) : (
        <span className="text-gray-500 text-sm flex-shrink-0">Locked</span>
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
  const allEquippedItems = useMemo(() => {
    const equipped = new Set<string>();
    Object.values(housing.equippedItems).forEach((items) => {
      items.forEach((itemId) => equipped.add(itemId));
    });
    return equipped;
  }, [housing.equippedItems]);

  // Group items by effect category
  const itemsByCategory: Record<string, typeof HOUSING_ITEM_DEFS[string][]> = {};
  Object.values(HOUSING_ITEM_DEFS)
    .filter((item) => !item.requiresUnlock || housing.unlockedItems.includes(item.id))
    .forEach((item) => {
      if (!itemsByCategory[item.effect]) {
        itemsByCategory[item.effect] = [];
      }
      itemsByCategory[item.effect].push(item);
    });

  // Category order
  const categoryOrder: ItemCategory[] = ['skillCap', 'passiveGen', 'actionBonus', 'combatDamage', 'healthRegen', 'spellCooldown'];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Items</h2>
      <div className="flex flex-col">
        {categoryOrder.map((category) => {
          const items = itemsByCategory[category];
          if (!items || items.length === 0) return null;

          const itemRows = items.map((item) => {
            const equipped = allEquippedItems.has(item.id);
            const canAfford = !equipped && canAffordItem(state, item);
            const unlocked = !item.requiresUnlock || housing.unlockedItems.includes(item.id);

            return (
              <ItemRow
                key={item.id}
                item={item}
                equipped={equipped}
                unlocked={unlocked}
                canAfford={canAfford}
                onEquip={() => equipItem(getHouseToEquipTo(), item.id)}
                onUnequip={() => unequipItemById(item.id)}
              />
            );
          });

          return (
            <ItemCategoryGroup key={category} category={category} items={itemRows} />
          );
        })}
      </div>
    </div>
  );
}
