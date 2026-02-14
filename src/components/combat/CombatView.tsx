import { useGameStore } from '../../stores/gameStore';
import { DungeonSelection } from './DungeonSelection';
import { CombatActive } from './CombatActive';

export function CombatView() {
  const combat = useGameStore((s) => s.combat);

  if (!combat.isActive) {
    return <DungeonSelection />;
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

  return <CombatActive enemy={enemy} />;
}
