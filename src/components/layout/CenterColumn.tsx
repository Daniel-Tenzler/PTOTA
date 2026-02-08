import { useGameStore } from '../../stores/gameStore';
import { ActionsView } from '../actions/ActionsView';
import { SkillsView } from '../skills/SkillsView';
import { SpellsView } from '../spells/SpellsView';
import { CombatView } from '../combat/CombatView';

export function CenterColumn() {
  const activeTab = useGameStore((s) => s.activeTab);

  return (
    <div className="flex-1 p-6 overflow-y-auto">
      {activeTab === 'actions' && <ActionsView />}
      {activeTab === 'skills' && <SkillsView />}
      {activeTab === 'spells' && <SpellsView />}
      {activeTab === 'combat' && <CombatView />}
    </div>
  );
}
