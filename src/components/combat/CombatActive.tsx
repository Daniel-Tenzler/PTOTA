import { useGameStore } from '../../stores/gameStore';
import { PLAYER_ATTACK_INTERVAL } from '../../constants/combat';
import { stopCombat } from '../../systems/combat';
import { CombatPanel } from './CombatPanel';
import { CombatLog } from './CombatLog';
import type { Enemy } from '../../types';

interface CombatActiveProps {
  enemy: Enemy;
}

export function CombatActive({ enemy }: CombatActiveProps) {
  const health = useGameStore((s) => s.specialResources.health);
  const combat = useGameStore((s) => s.combat);

  const handleStopCombat = () => {
    useGameStore.getState().updateCombat(stopCombat);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-100">Combat</h2>
        <button
          onClick={handleStopCombat}
          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-gray-400 text-sm rounded"
        >
          Stop
        </button>
      </div>

      {/* Side-by-side combat panels */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Player - Left */}
        <CombatPanel
          label="You"
          current={health.current}
          max={health.max}
          healthColor="green"
          attackInterval={PLAYER_ATTACK_INTERVAL}
          attackTimer={combat.playerAttackTimer}
          attackColor="blue"
        />

        {/* Enemy - Right */}
        <CombatPanel
          label={enemy.name}
          current={enemy.health}
          max={enemy.maxHealth}
          healthColor="red"
          attackInterval={enemy.attackInterval}
          attackTimer={combat.enemyAttackTimer || enemy.attackInterval}
          attackColor="orange"
        />
      </div>

      {/* Centered combat log below */}
      <CombatLog log={combat.log} />
    </div>
  );
}
