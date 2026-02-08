import { useGameStore } from '../../stores/gameStore';
import { SKILL_DEFS } from '../../data/skills';
import { getSkillProgress } from '../../systems/skills';

export function SkillsView() {
  const skills = useGameStore((s) => s.skills);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-100 mb-6">Skills</h2>
      <div className="space-y-4 max-w-md">
        {Object.entries(skills).map(([skillId, skill]) => {
          const def = SKILL_DEFS[skillId];
          if (!def) return null;

          const progress = getSkillProgress(skill, def);

          return (
            <div key={skillId} className="bg-gray-800 p-4 rounded">
              <div className="flex justify-between mb-2">
                <span className="text-gray-100">{def.name}</span>
                <span className="text-gray-400">Level {skill.level}</span>
              </div>
              <div className="h-2 bg-gray-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-600 transition-all duration-300"
                  style={{ width: `${progress.percent}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {Math.floor(progress.current)} / {progress.needed} XP
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
