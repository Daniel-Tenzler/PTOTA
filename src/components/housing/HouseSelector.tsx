import type { HousingState, Resources } from '../../types';
import { useGameStore } from '../../stores/gameStore';
import { HOUSE_DEFS } from '../../data/housing';
import { canAffordHouse } from '../../systems/housing';
import type { GameState } from '../../types';
import { useTooltip } from '../tooltip/index';

interface HouseSelectorProps {
  housing: HousingState;
  resources: Resources;
}

// House tooltip data interface
interface HouseTooltipData {
  name: string;
  description: string;
  space: number;
  cost: Record<string, number>;
}

// House tooltip renderer
function houseTooltipRenderer({ name, description, space, cost }: HouseTooltipData) {
  return (
    <div className="max-w-xs">
      <div className="font-semibold mb-1">{name}</div>
      <div className="text-sm text-gray-400 mb-2">{description}</div>
      <div className="text-xs text-gray-500">
        <div className="mb-1">Space: {space}</div>
        {cost && Object.keys(cost).length > 0 && (
          <div className="mt-2">
            Cost:
            {Object.entries(cost).map(([resource, amount]) => (
              <div key={resource} className="text-sm">
                {amount} {resource}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function HouseCard({
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
  const tooltipData = {
    name: house.name,
    description: house.description,
    space: house.space,
    cost: house.cost,
  };

  const { triggerProps, tooltipElement } = useTooltip(
    houseTooltipRenderer,
    tooltipData
  );

  return (
    <div className={`bg-gray-800 rounded p-4 flex-1 min-w-[200px] flex flex-col ${
      owned ? 'ring-2 ring-green-500' : ''
    }`}>
      <h3 className="text-lg font-medium mb-1">{house.name}</h3>
      <span className="text-sm bg-gray-700 px-2 py-1 rounded">
        {house.space} space
      </span>
      {tooltipElement}
      {owned ? (
        <div className="text-green-400 text-sm">Owned</div>
      ) : canAfford ? (
        <button
          {...triggerProps}
          onClick={onPurchase}
          disabled={!canAfford}
          className="mt-auto px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition-colors"
        >
          Purchase
        </button>
      ) : (
        <div className="mt-auto text-sm text-gray-500">Cannot afford</div>
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
      <div className="flex gap-3 overflow-x-auto pb-2">
        {purchasableHouses.map((house) => {
          const owned = housing.ownedHouses.includes(house.id);
          const canAfford = canAffordHouse(state, house);

          return (
            <HouseCard
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
