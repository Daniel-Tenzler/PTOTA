import { TooltipSection, ResourceList, StatRow } from '../layout';
import type { ActionDefinition, ActionState } from '../../../types';

interface ActionRendererProps {
  definition: ActionDefinition;
  state: ActionState;
}

// Format number to remove trailing zeros
function formatNum(value: number): string {
  // Round to avoid floating point precision issues
  const rounded = Math.round(value * 100) / 100;
  if (Number.isInteger(rounded)) return rounded.toString();
  return rounded.toString();
}

export function actionRenderer({ definition, state }: ActionRendererProps) {
  const hasRankBonus = state.executionCount >= 10;
  const bonusPercent = definition.rankBonus(state.executionCount);
  const isUnlock = definition.category === 'unlock';

  return (
    <div className="space-y-3">
      <div className="text-gray-100 font-semibold">{definition.name}</div>

      {/* Requirements */}
      {Object.entries(definition.inputs).length > 0 && !isUnlock ? (
        <TooltipSection label="Cost">
          <ResourceList resources={definition.inputs} />
        </TooltipSection>
      ) : null}

      {definition.unlockCost && Object.entries(definition.unlockCost).length > 0 ? (
        <TooltipSection label="Unlock Cost">
          <ResourceList resources={definition.unlockCost} />
        </TooltipSection>
      ) : null}

      {definition.staminaCost && definition.staminaCost > 0 ? (
        <StatRow label="Stamina" value={definition.staminaCost} />
      ) : null}

      {definition.requiredSkill ? (
        <div className="text-xs text-gray-500">
          Requires: {definition.requiredSkill.skillId} level {definition.requiredSkill.level}
        </div>
      ) : null}

      {/* Outputs */}
      {!isUnlock && Object.entries(definition.outputs).length > 0 ? (
        <TooltipSection label="Gain">
          <ResourceList resources={definition.outputs} bonus={bonusPercent} />
        </TooltipSection>
      ) : null}

      {definition.effect ? (
        <div className="text-xs text-gray-500">
          Effect: {definition.effect}
        </div>
      ) : null}

      {/* Execution Info */}
      {definition.duration && definition.duration > 0 ? (
        <StatRow label="Interval" value={`${definition.duration}s`} />
      ) : null}

      {definition.skillXp && Object.entries(definition.skillXp).length > 0 ? (
        <TooltipSection label="Skill XP">
          <div className="text-gray-300">
            {Object.entries(definition.skillXp).map(([skill, xp], index) => (
              <span key={skill}>
                {index > 0 ? ', ' : null}
                {formatNum(xp)} {skill}
              </span>
            ))}
          </div>
        </TooltipSection>
      ) : null}

      {/* Rank Progress */}
      {hasRankBonus && bonusPercent > 0 ? (
        <div className="text-green-400 text-xs">
          Rank bonus: +{formatNum(bonusPercent * 100)}% ({state.executionCount} uses)
        </div>
      ) : null}

      {!hasRankBonus && state.executionCount > 0 ? (
        <div className="text-gray-600 text-xs">
          Progress: {state.executionCount}/10 uses to unlock rank bonus
        </div>
      ) : null}
    </div>
  );
}
