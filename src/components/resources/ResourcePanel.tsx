import { useGameStore } from '../../stores/gameStore';
import { ALL_ACTION_DEFS } from '../../systems/actions';
import { ActiveTimedActionDisplay } from './ActiveTimedActionDisplay';
import { ResourceIcon } from './ResourceIcon';
import { RESOURCE_CONFIG } from '../../config/resources';

/**
 * Static color mappings for resources.
 * NOTE: These literal class names are required for Tailwind JIT to detect and include them in the build.
 * Dynamic class construction (like `text-${color}-400`) would not work with Tailwind's JIT mode.
 */
const RESOURCE_COLOR_CONFIG: Record<string, { text: string; bg: string }> = {
  yellow: { text: 'text-yellow-400', bg: 'bg-yellow-500' },
  stone: { text: 'text-stone-400', bg: 'bg-stone-500' },
  purple: { text: 'text-purple-400', bg: 'bg-purple-500' },
  gray: { text: 'text-gray-400', bg: 'bg-gray-500' },
  cyan: { text: 'text-cyan-400', bg: 'bg-cyan-500' },
  orange: { text: 'text-orange-400', bg: 'bg-orange-500' },
  amber: { text: 'text-amber-400', bg: 'bg-amber-500' },
  emerald: { text: 'text-emerald-400', bg: 'bg-emerald-500' },
};

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
  const actions = useGameStore((s) => s.actions);

  // Find all active timed actions (study + regular)
  const activeTimedActionIds = Object.entries(actions)
    .filter(([id, state]) => {
      const def = ALL_ACTION_DEFS[id];
      return def?.category === 'timed' && state.isActive;
    })
    .map(([id]) => id);

  // Get all resource IDs, ordered by RESOURCE_ORDER preference, then any extras
  const resourceIds = Object.keys(resources).sort((a, b) => {
    const aIndex = RESOURCE_ORDER.indexOf(a as typeof RESOURCE_ORDER[number]);
    const bIndex = RESOURCE_ORDER.indexOf(b as typeof RESOURCE_ORDER[number]);
    const aOrdered = aIndex !== -1;
    const bOrdered = bIndex !== -1;

    if (aOrdered && bOrdered) return aIndex - bIndex;
    if (aOrdered) return -1;
    if (bOrdered) return 1;
    return a.localeCompare(b);
  });

  return (
    <div className="w-64 border-l border-gray-700 bg-gray-900 p-4">
      <h2 className="text-sm font-semibold text-gray-400 mb-3">Resources</h2>

      <div className="space-y-2 text-sm">
        {resourceIds.map((id) => (
          <ResourceRow key={id} resourceId={id} name={formatResourceName(id)} value={resources[id] || 0} />
        ))}
      </div>

      <div className="mt-6 space-y-3">
        <SpecialResourceRow name="Stamina" resourceId="stamina" {...stamina} />
        <SpecialResourceRow name="Health" resourceId="health" {...health} />
      </div>

      {activeTimedActionIds.length > 0 && (
        <div className="mt-6 space-y-3">
          <h2 className="text-sm font-semibold text-gray-400">In Progress</h2>
          {activeTimedActionIds.map((actionId) => (
            <ActiveTimedActionDisplay key={actionId} actionId={actionId} />
          ))}
        </div>
      )}
    </div>
  );
}

function ResourceRow({ resourceId, name, value }: { resourceId: string; name: string; value: number }) {
  const displayValue = value < 10 ? parseFloat(value.toFixed(1)) : Math.floor(value);
  const config = RESOURCE_CONFIG[resourceId];
  const colorClass = config?.color && RESOURCE_COLOR_CONFIG[config.color]
    ? RESOURCE_COLOR_CONFIG[config.color].text
    : 'text-gray-400';

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <ResourceIcon resourceId={resourceId} />
        <span className={colorClass}>{name}</span>
      </div>
      <span className="text-gray-100">{displayValue}</span>
    </div>
  );
}

function SpecialResourceRow({ resourceId, name, current, max }: { resourceId: string; name: string; current: number; max: number }) {
  const percent = (current / max) * 100;
  const config = RESOURCE_CONFIG[resourceId];
  const barColorClass = config?.color && RESOURCE_COLOR_CONFIG[config.color]
    ? RESOURCE_COLOR_CONFIG[config.color].bg
    : 'bg-gray-600';

  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <div className="flex items-center gap-1.5">
          <ResourceIcon resourceId={resourceId} />
          <span className="text-gray-400">{name}</span>
        </div>
        <span className="text-gray-100">{parseFloat(current.toFixed(1))}/{max}</span>
      </div>
      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColorClass} transition-all duration-75`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
