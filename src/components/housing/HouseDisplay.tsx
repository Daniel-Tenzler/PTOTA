import type { HousingState } from '../../types';
import { HOUSE_DEFS, HOUSING_ITEM_DEFS } from '../../data/housing';
import { useTooltip } from '../tooltip/index';

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

  return (
    <div className="bg-gray-800 rounded p-4">
      <h2 className="text-xl font-semibold mb-2">Current Housing</h2>
      {tooltipElement}
      <div className="flex items-center justify-between">
        <div {...triggerProps} className="text-lg font-medium cursor-help">
          {currentHouse.name}
        </div>
      </div>
    </div>
  );
}
