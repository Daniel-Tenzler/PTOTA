import type { HousingState, Resources } from '../../types';
import { useGameStore } from '../../stores/gameStore';
import { HOUSE_DEFS } from '../../data/housing';
import { canAffordHouse } from '../../systems/housing';
import type { GameState } from '../../types';
import { useTooltip } from '../tooltip/index';
import { HOUSE_ICONS, type HouseTier } from './housingIcons';
import { genericTooltipRenderer, formatHouseTooltipData } from '../tooltip/GenericTooltip';

interface HouseSelectorProps {
  housing: HousingState;
  resources: Resources;
}

function HouseRow({
  house,
  owned,
  canAfford,
  onPurchase,
}: {
  house: { id: string; name: string; space: number; cost: Record<string, number>; description: string };
  owned: boolean;
  canAfford: boolean;
  onPurchase: () => void;
}) {
  const HouseIcon = HOUSE_ICONS[house.id as HouseTier];
  const tooltipData = formatHouseTooltipData(
    house.name,
    house.description,
    house.space,
    house.cost
  );

  const { triggerProps, tooltipElement } = useTooltip(
    genericTooltipRenderer,
    tooltipData
  );

  return (
    <div className="flex items-center gap-3 p-2 rounded hover:bg-gray-700/50 border-b border-gray-700 last:border-b-0">
      <HouseIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
      <div {...triggerProps} className="flex-1 min-w-0">
        <span className="font-medium">{house.name}</span>
        <span className="text-gray-400 ml-2">· {house.space} space</span>
      </div>
      {tooltipElement}
      {owned ? (
        <span className="px-2 py-1 rounded bg-green-900/50 text-green-400 text-sm">Owned</span>
      ) : canAfford ? (
        <button
          onClick={onPurchase}
          className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm transition-colors"
        >
          Purchase
        </button>
      ) : (
        <span className="text-gray-500 text-sm">Cannot afford</span>
      )}
    </div>
  );
}

export function HouseSelector({ housing }: HouseSelectorProps) {
  const purchaseHouse = useGameStore((s) => s.purchaseHouse);
  const state = useGameStore((s) => s) as GameState;

  // Filter out shelter (it's the starter house, not purchasable)
  const purchasableHouses = Object.values(HOUSE_DEFS).filter(
    (h) => h.id !== 'shelter'
  );

  return (
    <div>
      <h2 className="text-lg font-semibold mb-3">Houses</h2>
      <div className="flex flex-col bg-gray-800 rounded">
        {purchasableHouses.map((house) => {
          const owned = housing.ownedHouses.includes(house.id);
          const canAfford = canAffordHouse(state, house);

          return (
            <HouseRow
              key={house.id}
              house={house}
              owned={owned}
              canAfford={canAfford}
              onPurchase={() => purchaseHouse(house.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
