import { useGameStore } from '../../stores/gameStore';

export function ResourcePanel() {
  const resources = useGameStore((s) => s.resources);
  const stamina = useGameStore((s) => s.specialResources.stamina);
  const health = useGameStore((s) => s.specialResources.health);

  return (
    <div className="w-48 border-l border-gray-700 bg-gray-900 p-4">
      <h2 className="text-sm font-semibold text-gray-400 mb-3">Resources</h2>

      <div className="space-y-2 text-sm">
        <ResourceRow name="Gold" value={resources.gold || 0} />
        <ResourceRow name="Scrolls" value={resources.scrolls || 0} />
        <ResourceRow name="Enchanted Scrolls" value={resources['enchanted scrolls'] || 0} />
      </div>

      <div className="mt-6 space-y-3">
        <SpecialResourceRow name="Stamina" {...stamina} />
        <SpecialResourceRow name="Health" {...health} />
      </div>
    </div>
  );
}

function ResourceRow({ name, value }: { name: string; value: number }) {
  const displayValue = value < 10 ? parseFloat(value.toFixed(1)) : Math.floor(value);
  return (
    <div className="flex justify-between">
      <span className="text-gray-400">{name}</span>
      <span className="text-gray-100">{displayValue}</span>
    </div>
  );
}

function SpecialResourceRow({ name, current, max }: { name: string; current: number; max: number }) {
  const percent = (current / max) * 100;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">{name}</span>
        <span className="text-gray-100">{parseFloat(current.toFixed(1))}/{max}</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-600 transition-all duration-75"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
