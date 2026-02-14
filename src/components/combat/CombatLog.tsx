import type { CombatLogEntry } from '../../types';

interface CombatLogProps {
  log: CombatLogEntry[];
}

export function CombatLog({ log }: CombatLogProps) {
  if (log.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-800 p-4 rounded w-full max-w-2xl mx-auto">
      <div className="text-sm font-semibold text-gray-400 mb-2">Combat Log</div>
      <div className="space-y-1 max-h-40 overflow-y-auto">
        {log.slice().reverse().map((entry: CombatLogEntry, index: number) => (
          <div
            key={`${entry.timestamp}-${entry.type}-${index}`}
            className={`text-xs ${
              entry.type === 'spell-cast' ? 'text-purple-400' :
              entry.type === 'enemy-defeat' ? 'text-yellow-400' :
              entry.type === 'enemy-attack' ? 'text-orange-400' :
              'text-gray-400'
            }`}
          >
            {entry.message}
          </div>
        ))}
      </div>
    </div>
  );
}
