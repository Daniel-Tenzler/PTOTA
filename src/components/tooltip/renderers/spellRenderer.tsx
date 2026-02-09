import { StatRow } from '../layout';
import type { SpellDefinition } from '../../../types';

interface SpellRendererProps {
  definition: SpellDefinition;
  currentCooldown?: number;
}

export function spellRenderer({ definition, currentCooldown = 0 }: SpellRendererProps) {
  return (
    <div className="space-y-3">
      <div className="text-gray-100 font-semibold">{definition.name}</div>

      {/* Description */}
      {definition.description ? (
        <div className="text-gray-400 text-sm">{definition.description}</div>
      ) : null}

      {/* Stats */}
      <StatRow label="Cooldown" value={`${definition.cooldown}s`} />

      {currentCooldown > 0 ? (
        <div className="text-yellow-400 text-xs">
          Current cooldown: {parseFloat(currentCooldown.toFixed(1))}s
        </div>
      ) : null}
    </div>
  );
}
