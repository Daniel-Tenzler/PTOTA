import { useGameStore } from '../../stores/gameStore';
import { HouseDisplay } from './HouseDisplay';
import { HouseSelector } from './HouseSelector';
import { ItemsCatalog } from './ItemsCatalog';

export function HousingView() {
  const housing = useGameStore((s) => s.housing);
  const resources = useGameStore((s) => s.resources);

  return (
    <div className="flex flex-col gap-6">
      <HouseDisplay housing={housing} />
      <HouseSelector housing={housing} resources={resources} />
      <ItemsCatalog housing={housing} resources={resources} />
    </div>
  );
}
