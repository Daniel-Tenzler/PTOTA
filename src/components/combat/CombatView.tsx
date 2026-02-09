import { useGameStore } from '../../stores/gameStore';
import { DUNGEON_DEFS } from '../../data/dungeons';
import { startCombat, stopCombat } from '../../systems/combat';
import { PLAYER_ATTACK_INTERVAL } from '../../constants/combat';
import { ProgressBar } from './ProgressBar';

export function CombatView() {
  const combat = useGameStore((s) => s.combat);
  const health = useGameStore((s) => s.specialResources.health);
  const dungeons = useGameStore((s) => s.dungeons);
  const arcaneLevel = useGameStore((s) => s.skills.arcane?.level || 1);

  if (!combat.isActive) {
    // Show dungeon selection
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-100 mb-6">Select Dungeon</h2>
        <div className="grid gap-3 max-w-md">
          {Object.values(DUNGEON_DEFS)
            .filter(d => arcaneLevel >= d.levelRequirement)
            .map(dungeon => (
              <button
                key={dungeon.id}
                onClick={() => {
                  useGameStore.setState({
                    dungeons: {
                      ...dungeons,
                      selected: dungeon.id
                    }
                  });
                  useGameStore.getState().updateCombat(startCombat);
                }}
                className={`
                  p-4 rounded text-left transition-colors
                  ${dungeons.selected === dungeon.id
                    ? 'bg-gray-700 border border-gray-600'
                    : 'bg-gray-800 hover:bg-gray-700'
                  }
                `}
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-100">{dungeon.name}</span>
                  <span className="text-xs text-gray-500">Difficulty: {dungeon.difficulty}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{dungeon.description}</p>
                {dungeon.levelRequirement > 1 && (
                  <div className="text-xs text-gray-600 mt-2">
                    Requires Arcane Level {dungeon.levelRequirement}
                  </div>
                )}
              </button>
            ))}
        </div>
      </div>
    );
  }

  const enemy = combat.currentEnemy;
  if (!enemy) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-gray-100 mb-6">Combat</h2>
        <p className="text-gray-400">Spawning enemy...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Combat</h2>
        <button
          onClick={() => {
            useGameStore.getState().updateCombat(stopCombat);
          }}
          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-400 text-sm rounded"
        >
          Stop
        </button>
      </div>

      <div className="max-w-md space-y-6">
        {/* Enemy */}
        <ProgressBar
          label={enemy.name}
          current={enemy.health}
          max={enemy.maxHealth}
          healthColor="red"
          attackInterval={enemy.attackInterval}
          attackTimer={combat.enemyAttackTimer || enemy.attackInterval}
          attackColor="orange"
        />

        {/* Player */}
        <ProgressBar
          label="You"
          current={health.current}
          max={health.max}
          healthColor="green"
          attackInterval={PLAYER_ATTACK_INTERVAL}
          attackTimer={combat.playerAttackTimer}
          attackColor="blue"
        />

        {/* Combat Log */}
        {combat.log.length > 0 && (
          <div className="bg-gray-800 p-4 rounded">
            <div className="text-sm font-semibold text-gray-400 mb-2">Combat Log</div>
            <div className="space-y-1 max-h-40 overflow-y-auto">
              {combat.log.slice().reverse().map((entry) => (
                <div
                  key={entry.timestamp}
                  className={`text-xs ${
                    entry.type === 'spell-cast' ? 'text-purple-400' :
                    entry.type === 'enemy-defeat' ? 'text-yellow-400' :
                    entry.type === 'enemy-attack' ? 'text-orange-400' :
                    'text-gray-400'
                  }`}
                >
                  {entry.message}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
