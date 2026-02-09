import { useMemo } from 'react';
import { ALL_ACTION_DEFS } from '../../systems/actions';
import { useGameStore } from '../../stores/gameStore';
import { useTooltip, actionRenderer } from '../tooltip';

interface Props {
  actionId: string;
}

export function ActionButton({ actionId }: Props) {
  const definition = ALL_ACTION_DEFS[actionId];
  const { executeAction, toggleTimedAction } = useGameStore();

  if (!definition) {
    return null;
  }

  const actionState = useGameStore((s) => s.actions[actionId]);
  const isActive = actionState?.isActive || false;
  const isTimed = definition.category === 'timed';
  const isUnlock = definition.category === 'unlock';

  const handleClick = () => {
    if (isTimed) {
      toggleTimedAction(actionId);
    } else {
      executeAction(actionId);
    }
  };

  const canExec = useGameStore((s) => {
    const resources = s.resources;
    const stamina = s.specialResources.stamina.current;

    // Check stamina
    if (definition.staminaCost && stamina < definition.staminaCost) return false;

    // Check inputs
    for (const [resource, amount] of Object.entries(definition.inputs)) {
      if ((resources[resource] || 0) < amount) return false;
    }

    // Check unlock cost
    if (definition.unlockCost) {
      for (const [resource, amount] of Object.entries(definition.unlockCost)) {
        if ((resources[resource] || 0) < amount) return false;
      }
    }

    return true;
  });

  // Memoize tooltip data to prevent infinite re-renders
  const tooltipData = useMemo(
    () => ({
      definition,
      state: actionState || { executionCount: 0, isUnlocked: true, isActive: false, lastExecution: 0 },
    }),
    [definition, actionState]
  );

  const { triggerProps, tooltipElement } = useTooltip(
    actionRenderer,
    tooltipData
  );

  return (
    <>
      <button
        {...triggerProps}
        onClick={handleClick}
        disabled={!canExec && !isActive}
        className={`
          px-3 py-1.5 rounded text-sm font-medium transition-colors whitespace-nowrap
          ${isActive
            ? 'bg-green-900/80 border border-green-700 text-green-100'
            : canExec
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-200'
              : 'bg-gray-900/50 text-gray-600'
          }
        `}
      >
        <span className="flex items-center gap-2">
          {definition.name}
          {isTimed && (
            <span className="text-xs opacity-70">
              {isActive ? '●' : '○'}
            </span>
          )}
          {isUnlock && (
            <span className="text-xs opacity-50">
              ⟡
            </span>
          )}
        </span>
      </button>
      {tooltipElement}
    </>
  );
}
