import { ActionButton } from './ActionButton';
import { useGameStore } from '../../stores/gameStore';
import { ALL_ACTION_DEFS, isStudyAction } from '../../systems/actions';

export function ActionsView() {
  const actions = useGameStore((s) => Object.keys(s.actions));
  const actionStates = useGameStore((s) => s.actions);

  // Group actions by category, only showing unlocked actions
  // Unlock actions are always shown (until purchased), other actions must be unlocked
  const resourceActions = actions.filter(id => {
    const def = ALL_ACTION_DEFS[id];
    const state = actionStates[id];
    return !isStudyAction(id) && def?.category === 'resource-producing' && state?.isUnlocked;
  });

  const timedActions = actions.filter(id => {
    const def = ALL_ACTION_DEFS[id];
    const state = actionStates[id];
    return !isStudyAction(id) && def?.category === 'timed' && state?.isUnlocked;
  });

  const unlockActions = actions.filter(id => {
    const def = ALL_ACTION_DEFS[id];
    return def?.category === 'unlock';
  });

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-100 mb-6">Actions</h2>

      {resourceActions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm text-gray-400 mb-3">Actions</h3>
          <div className="grid gap-3 max-w-md">
            {resourceActions.map(id => (
              <ActionButton key={id} actionId={id} />
            ))}
          </div>
        </div>
      )}

      {timedActions.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm text-gray-400 mb-3">Timed Actions</h3>
          <div className="grid gap-3 max-w-md">
            {timedActions.map(id => (
              <ActionButton key={id} actionId={id} />
            ))}
          </div>
        </div>
      )}

      {unlockActions.length > 0 && (
        <div>
          <h3 className="text-sm text-gray-400 mb-3">Unlocks</h3>
          <div className="grid gap-3 max-w-md">
            {unlockActions.map(id => (
              <ActionButton key={id} actionId={id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
