import { TooltipSection } from '../layout';
import { getSkillProgress } from '../../../systems/skills';
import { formatNum } from '../../../utils/format';
import type { SkillDefinition, SkillState } from '../../../types';

interface SkillRendererProps {
  definition: SkillDefinition;
  state: SkillState;
}

function getBonusDescription(effect: string, value: string | number | boolean): string {
  switch (effect) {
    case 'unlock-action':
      return `Unlocks action: ${value}`;
    case 'unlock-spell-slot':
      return `Unlocks ${value} spell slot${value as number > 1 ? 's' : ''}`;
    case 'effectiveness-boost':
      return `+${formatNum((value as number) * 100)}% effectiveness for certain actions`;
    default:
      return String(value);
  }
}

export function skillRenderer({ definition, state }: SkillRendererProps) {
  const progress = getSkillProgress(state, definition);
  const currentBonus = definition.bonuses.find((b) => b.level === state.level);
  const nextBonus = definition.bonuses.find((b) => b.level === state.level + 1);
  const maxLevel = definition.xpTable.length - 1;

  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-gray-100 font-semibold">{definition.name}</span>
        <span className="text-gray-400">
          Level {state.level}/{maxLevel}
        </span>
      </div>

      {/* XP Progress */}
      {state.level < maxLevel ? (
        <TooltipSection label="Progress">
          <div className="text-gray-300">
            {formatNum(Math.floor(progress.current))} / {formatNum(progress.needed)} XP
          </div>
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden mt-1">
            <div
              className="h-full bg-gray-600"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </TooltipSection>
      ) : null}

      {state.level >= maxLevel ? (
        <div className="text-yellow-400 text-xs">Maximum level reached</div>
      ) : null}

      {/* Current Bonus */}
      {currentBonus ? (
        <TooltipSection label="Current Bonus">
          <div className="text-gray-300 text-sm">
            {getBonusDescription(currentBonus.effect, currentBonus.value)}
          </div>
        </TooltipSection>
      ) : null}

      {/* Next Bonus */}
      {nextBonus && state.level < maxLevel ? (
        <TooltipSection label="Next Level">
          <div className="text-gray-400 text-sm">
            {getBonusDescription(nextBonus.effect, nextBonus.value)}
          </div>
        </TooltipSection>
      ) : null}

      {/* No more bonuses */}
      {!nextBonus && state.level < maxLevel ? (
        <div className="text-gray-600 text-xs">No further bonuses available</div>
      ) : null}
    </div>
  );
}
