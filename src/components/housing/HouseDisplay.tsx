import type { HousingState } from '../../types';
import { HOUSE_DEFS, HOUSING_ITEM_DEFS } from '../../data/housing';
import { useTooltip } from '../tooltip/index';
import { Info } from 'lucide-react';
import { HOUSE_ICONS, type HouseTier } from './housingIcons';

interface HouseDisplayProps {
  housing: HousingState;
}

// House display tooltip data interface
interface HouseDisplayTooltipData {
  name: string;
  description: string;
  spaceUsed: number;
  totalSpace: number;
}

// House display tooltip renderer
function houseDisplayTooltipRenderer({ name, description, spaceUsed, totalSpace }: HouseDisplayTooltipData) {
  return (
    <div className="max-w-xs">
      <div className="font-semibold mb-1">{name}</div>
      <div className="text-sm text-gray-400 mb-2">{description}</div>
      <div className="text-xs text-gray-500">
        Space: {spaceUsed} / {totalSpace}
      </div>
    </div>
  );
}

export function HouseDisplay({ housing }: HouseDisplayProps) {
  // Get the most recently purchased house (last in array)
  const currentHouseId = housing.ownedHouses[housing.ownedHouses.length - 1] || 'shelter';
  const currentHouse = HOUSE_DEFS[currentHouseId];

  // Calculate total space used across all owned houses
  const totalSpaceUsed = Object.entries(housing.equippedItems).reduce(
    (sum, [, items]) => {
      const itemsSpace = items.reduce((itemSum, itemId) => {
        const item = HOUSING_ITEM_DEFS[itemId];
        return itemSum + (item?.space || 0);
      }, 0);
      return sum + itemsSpace;
    },
    0
  );

  const totalSpace = housing.ownedHouses.reduce(
    (sum, houseId) => sum + (HOUSE_DEFS[houseId]?.space || 0),
    0
  );

  const tooltipData = {
    name: currentHouse.name,
    description: currentHouse.description,
    spaceUsed: totalSpaceUsed,
    totalSpace,
  };

  const { triggerProps, tooltipElement } = useTooltip(
    houseDisplayTooltipRenderer,
    tooltipData
  );

  const HouseIcon = HOUSE_ICONS[currentHouseId as HouseTier];

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-800/80 rounded-lg p-4 border border-gray-700 shadow-sm">
      <h2 className="text-xl font-bold mb-3 text-gray-100">Current Housing</h2>
      {tooltipElement}
      <div
        {...triggerProps}
        className="flex items-center gap-3 p-3 rounded-lg bg-gray-900/50 border border-gray-700/50 hover:border-gray-600 transition-colors cursor-help group"
      >
        <HouseIcon className="w-8 h-8 text-blue-400 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-gray-100">{currentHouse.name}</span>
            <Info className="w-4 h-4 text-gray-500 group-hover:text-gray-400 transition-colors" />
          </div>
          <div className="text-sm text-gray-400 mt-0.5">
            {totalSpaceUsed} / {totalSpace} space used
          </div>
        </div>
      </div>
    </div>
  );
}
