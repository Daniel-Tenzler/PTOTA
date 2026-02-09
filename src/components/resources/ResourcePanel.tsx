import { useGameStore } from '../../stores/gameStore';

// Define display order for resources. Any resource added to the store
// will automatically appear here - order is controlled by this list.
const RESOURCE_ORDER = [
  'gold',
  'scrolls',
  'enchanted scrolls',
  'ash',
  'springWater',
  'ore',
] as const;

// Auto-generate display name from resource ID
function formatResourceName(id: string): string {
  return id
    .split(/(?=[A-Z])|[\s-]/) // Split on camelCase boundaries or spaces/hyphens
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function ResourcePanel() {
  const resources = useGameStore((s) => s.resources);
  const stamina = useGameStore((s) => s.specialResources.stamina);
  const health = useGameStore((s) => s.specialResources.health);

  // Get all resource IDs, ordered by RESOURCE_ORDER preference, then any extras
  const resourceIds = Object.keys(resources).sort((a, b) => {
    const aIndex = RESOURCE_ORDER.indexOf(a as any);
    const bIndex = RESOURCE_ORDER.indexOf(b as any);
    const aOrdered = aIndex !== -1;
    const bOrdered = bIndex !== -1;

    if (aOrdered && bOrdered) return aIndex - bIndex;
    if (aOrdered) return -1;
    if (bOrdered) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="w-48 border-l border-gray-700 bg-gray-900 p-4">
      <h2 className="text-sm font-semibold text-gray-400 mb-3">Resources</h2>

      <div className="space-y-2 text-sm">
        {resourceIds.map((id) => (
          <ResourceRow key={id} name={formatResourceName(id)} value={resources[id] || 0} />
        ))}
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
