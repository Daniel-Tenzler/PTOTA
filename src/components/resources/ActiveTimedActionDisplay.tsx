import { ALL_ACTION_DEFS } from '../../systems/actions';
import { SKILL_DEFS } from '../../data/skills';
import { isStudyAction } from '../../systems/actions';
import { useGameStore } from '../../stores/gameStore';
import { Play } from 'lucide-react';
import { useMemo } from 'react';
import { useSmoothProgress } from '../../hooks/useSmoothProgress';

interface ActiveTimedActionDisplayProps {
  actionId: string;
}

/**
 * Displays an active timed action in the resource panel.
 * Shows a card with icon, action name, and progress bar.
 */
export function ActiveTimedActionDisplay({ actionId }: ActiveTimedActionDisplayProps) {
  const def = ALL_ACTION_DEFS[actionId];
  const actionState = useGameStore((s) => s.actions[actionId]);

  if (!def || !actionState || !actionState.isActive) return null;

  const duration = def.duration ?? 1;

  // Use smooth progress hook for 60fps updates
  const { progress, timeRemaining } = useSmoothProgress({
    duration,
    startTime: actionState.lastExecution,
    isRunning: actionState.isActive,
  });

  // Determine display name
  const displayName = useMemo(() => {
    if (isStudyAction(actionId)) {
      const skillId = actionId.replace('study-', '') as keyof typeof SKILL_DEFS;
      const skillDef = SKILL_DEFS[skillId];
      return skillDef ? `Studying ${skillDef.name}` : def.name;
    }
    return def.name;
  }, [actionId, def.name]);

  return (
    <div className="bg-gray-800 border border-gray-700 rounded p-3">
      <div className="flex items-center gap-2 mb-2">
        <Play className="h-4 w-4 text-amber-400 animate-pulse" />
        <span className="text-sm font-medium text-gray-200">{displayName}</span>
      </div>
      <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden mb-1">
        <div
          className="h-full bg-amber-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="text-xs text-gray-500 text-right">
        {timeRemaining}s left
      </div>
    </div>
  );
}
