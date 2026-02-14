import { TooltipSection, ResourceList, StatRow } from '../layout';
import { formatNum } from '../../../utils/format';
import type { ActionDefinition, ActionState, GameState } from '../../../types';

type ActionRendererGameState = Pick<GameState, 'resources' | 'specialResources' | 'skills'>;

interface ActionRendererProps {
  definition: ActionDefinition;
  state: ActionState;
  gameState: ActionRendererGameState;
}

export function actionRenderer({ definition, state, gameState }: ActionRendererProps) {
  const hasRankBonus = state.executionCount >= 10;
  const bonusPercent = definition.rankBonus(state.executionCount);
  const isUnlock = definition.category === 'unlock';

  // Check which resources are available for coloring
  const currentResources = gameState.resources;
  const currentStamina = gameState.specialResources.stamina.current;
  const currentSkills = gameState.skills;

  // Check if skill requirement is met
  const skillRequirementMet = !definition.requiredSkill || (
    (currentSkills[definition.requiredSkill.skillId]?.level || 0) >= definition.requiredSkill.level
  );

  return (
    <div className="space-y-3">
      <div className="text-gray-100 font-semibold">{definition.name}</div>

      {/* Requirements */}
      {Object.entries(definition.inputs).length > 0 && !isUnlock ? (
        <TooltipSection label="Cost">
          <ResourceList resources={definition.inputs} currentResources={currentResources} />
        </TooltipSection>
      ) : null}

      {definition.unlockCost && Object.entries(definition.unlockCost).length > 0 ? (
        <TooltipSection label="Unlock Cost">
          <ResourceList resources={definition.unlockCost} currentResources={currentResources} />
        </TooltipSection>
      ) : null}

      {definition.staminaCost && definition.staminaCost > 0 ? (
        <StatRow
          label="Stamina"
          value={definition.staminaCost}
          requirementMet={currentStamina >= definition.staminaCost}
        />
      ) : null}

      {definition.requiredSkill ? (
        <div className={`text-xs ${skillRequirementMet ? 'text-gray-500' : 'text-red-500'}`}>
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
          {definition.effect === 'unlock-housing-item'
            ? `Unlocks housing item: ${definition.value}`
            : `Effect: ${definition.effect}`}
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
