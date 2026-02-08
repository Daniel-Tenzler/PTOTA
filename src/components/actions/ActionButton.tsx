import { ALL_ACTION_DEFS } from '../../systems/actions';
import type { ActionDefinition } from '../../types';
import { useGameStore } from '../../stores/gameStore';

interface Props {
  actionId: string;
}

export function ActionButton({ actionId }: Props) {
  const definition = ALL_ACTION_DEFS[actionId];
  const { executeAction, toggleTimedAction } = useGameStore();

  if (!definition) return null;

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

  const tooltip = buildTooltip(definition);
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

  return (
    <button
      onClick={handleClick}
      disabled={!canExec && !isActive}
      className={`
        w-full px-4 py-3 rounded transition-colors text-left
        ${isActive
          ? 'bg-green-900 border border-green-700 text-green-100'
          : 'bg-gray-800 hover:bg-gray-700'
        }
        ${(!canExec && !isActive) && 'bg-gray-900 text-gray-600'}
      `}
      title={tooltip}
    >
      <div className="flex items-center justify-between">
        <span>{definition.name}</span>
        {isTimed && (
          <span className="text-xs">
            {isActive ? '● Active' : '○ Inactive'}
          </span>
        )}
        {isUnlock && (
          <span className="text-xs text-gray-500">
            One-time
          </span>
        )}
      </div>
    </button>
  );
}

function buildTooltip(def: ActionDefinition): string {
  const parts: string[] = [];

  // Inputs
  const inputs = Object.entries(def.inputs);
  if (inputs.length > 0) {
    parts.push('Cost: ' + inputs.map(([r, a]) => `${a} ${r}`).join(', '));
  }

  // Unlock cost
  if (def.unlockCost) {
    const unlockCost = Object.entries(def.unlockCost);
    if (unlockCost.length > 0) {
      parts.push('Unlock: ' + unlockCost.map(([r, a]) => `${a} ${r}`).join(', '));
    }
  }

  if (def.staminaCost) {
    parts.push(`Stamina: ${def.staminaCost}`);
  }

  // Outputs
  const outputs = Object.entries(def.outputs);
  if (outputs.length > 0) {
    parts.push('Gain: ' + outputs.map(([r, a]) => `${a} ${r}`).join(', '));
  }

  if (def.duration && def.duration > 0) {
    parts.push(`Interval: ${def.duration}s`);
  }

  if (def.effect) {
    parts.push(`Effect: ${def.effect}`);
  }

  return parts.join('\n');
}
