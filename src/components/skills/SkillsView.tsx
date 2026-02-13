import { useGameStore } from '../../stores/gameStore';
import { SKILL_DEFS } from '../../data/skills';
import { getSkillProgress } from '../../systems/skills';
import { useTooltip, skillRenderer } from '../tooltip';
import { SkillIcon } from './SkillIcon';
import { Circle } from 'lucide-react';

const SKILL_COLORS: Record<string, string> = {
  purple: '#a855f7',
  orange: '#f97316',
  blue: '#3b82f6',
  yellow: '#eab308',
  green: '#22c55e',
  pink: '#ec4899',
  cyan: '#06b6d4',
};

export function SkillsView() {
  const skills = useGameStore((s) => s.skills);
  const actions = useGameStore((s) => s.actions);
  const toggleStudyAction = useGameStore((s) => s.toggleStudyAction);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-100 mb-6">Skills</h2>
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(skills).map(([skillId, skill]) => {
          const def = SKILL_DEFS[skillId];
          if (!def) return null;

          const progress = getSkillProgress(skill, def);
          const studyActionId = `study-${skillId}`;
          const isStudyActive = actions[studyActionId]?.isActive ?? false;
          const isMaxLevel = skill.level >= def.xpTable.length;

          const activeColor = SKILL_COLORS[def.color ?? 'gray'] ?? '#6b7280';
          const activeStyle = isStudyActive
            ? {
                outline: '3px solid ' + activeColor,
                outlineOffset: '-3px',
                boxShadow: `0 0 12px ${activeColor}80`,
              }
            : undefined;

          const handleClick = () => {
            if (!isMaxLevel) {
              toggleStudyAction(studyActionId);
            }
          };

          const { triggerProps, tooltipElement } = useTooltip(
            skillRenderer,
            {
              definition: def,
              state: skill,
            }
          );

          return (
            <div
              key={skillId}
              {...triggerProps}
              onClick={handleClick}
              style={activeStyle}
              className={`group bg-gray-800 p-4 rounded hover:bg-gray-700 ${
                isStudyActive ? 'bg-gray-600 hover:bg-gray-600' : ''
              } ${!isMaxLevel ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className={`text-${def.color ?? 'gray'}-100`}>
                  <SkillIcon skillId={skillId} className="inline-block mr-2 align-text-bottom" />
                  {def.name}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Level {skill.level}</span>
                  {!isMaxLevel && (
                    <Circle
                      className={`h-3 w-3 transition-opacity ${
                        isStudyActive
                          ? ''
                          : 'text-gray-500 opacity-0 group-hover:opacity-100'
                      }`}
                      style={{
                        color: isStudyActive ? activeColor : undefined,
                      }}
                      fill={isStudyActive ? 'currentColor' : 'none'}
                    />
                  )}
                </div>
              </div>
              <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-${def.color ?? 'gray'}-500 transition-all duration-300`}
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.floor(progress.current)} / {progress.needed} XP
              </div>
              {tooltipElement}
            </div>
          );
        })}
      </div>
    </div>
  );
}
