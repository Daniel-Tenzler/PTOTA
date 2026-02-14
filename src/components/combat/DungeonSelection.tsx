import { useGameStore } from '../../stores/gameStore';
import { DUNGEON_DEFS } from '../../data/dungeons';
import { startCombat } from '../../systems/combat';
import { DungeonCard } from './DungeonCard';

export function DungeonSelection() {
  const dungeons = useGameStore((s) => s.dungeons);
  const arcaneLevel = useGameStore((s) => s.skills.arcane?.level || 1);
  const selectDungeon = useGameStore((s) => s.selectDungeon);

  const availableDungeons = Object.values(DUNGEON_DEFS)
    .filter(d => arcaneLevel >= d.levelRequirement);

  const handleSelectDungeon = (dungeonId: string) => {
    selectDungeon(dungeonId);
    useGameStore.getState().updateCombat(startCombat);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-100 mb-6">Select Dungeon</h2>
      <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
        {availableDungeons.map(dungeon => (
          <DungeonCard
            key={dungeon.id}
            dungeon={dungeon}
            isSelected={dungeons.selected === dungeon.id}
            onSelect={handleSelectDungeon}
          />
        ))}
      </div>
    </div>
  );
}
