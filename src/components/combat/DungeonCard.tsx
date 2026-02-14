import type { DungeonDefinition } from '../../types';

interface DungeonCardProps {
  dungeon: DungeonDefinition;
  isSelected: boolean;
  onSelect: (dungeonId: string) => void;
}

export function DungeonCard({ dungeon, isSelected, onSelect }: DungeonCardProps) {
  return (
    <button
      onClick={() => onSelect(dungeon.id)}
      className={`
        p-4 rounded text-left transition-colors
        ${isSelected
          ? 'bg-gray-700 border border-gray-600'
          : 'bg-gray-800 hover:bg-gray-700'
        }
      `}
    >
      <div className="flex justify-between items-center">
        <span className="text-gray-100">{dungeon.name}</span>
        <span className="text-xs text-gray-500">Difficulty: {dungeon.difficulty}</span>
      </div>
      <p className="text-sm text-gray-500 mt-1">{dungeon.description}</p>
      {dungeon.levelRequirement > 1 && (
        <div className="text-xs text-gray-600 mt-2">
          Requires Arcane Level {dungeon.levelRequirement}
        </div>
      )}
    </button>
  );
}
