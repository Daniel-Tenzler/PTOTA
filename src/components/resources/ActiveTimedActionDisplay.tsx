import { ALL_ACTION_DEFS } from '../../systems/actions';
import { SKILL_DEFS } from '../../data/skills';
import { isStudyAction } from '../../systems/actions';

interface ActiveTimedActionDisplayProps {
  actionId: string;
}

/**
 * Displays an active timed action in the resource panel.
 * Shows either "Studying [Skill Name]" for study actions
 * or the action name for regular timed actions.
 */
export function ActiveTimedActionDisplay({ actionId }: ActiveTimedActionDisplayProps) {
  const def = ALL_ACTION_DEFS[actionId];

  if (!def) return null;

  // For study actions, show "Studying [Skill Name]"
  if (isStudyAction(actionId)) {
    const skillId = actionId.replace('study-', '') as keyof typeof SKILL_DEFS;
    const skillDef = SKILL_DEFS[skillId];

    if (!skillDef) return null;

    return (
      <div className="text-sm">
        <span className="text-gray-400">Active: </span>
        <span className="text-gray-300">Studying {skillDef.name}</span>
      </div>
    );
  }

  // For regular timed actions, show the action name
  return (
    <div className="text-sm">
      <span className="text-gray-400">Active: </span>
      <span className="text-gray-300">{def.name}</span>
    </div>
  );
}
