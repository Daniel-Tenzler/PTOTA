import { useGameStore } from '../../stores/gameStore';

interface NavTabProps {
  id: 'actions' | 'skills' | 'spells' | 'combat' | 'housing';
  active: boolean;
  onClick: (id: 'actions' | 'skills' | 'spells' | 'combat' | 'housing') => void;
  children: React.ReactNode;
}

function NavTab({ id, active, onClick, children }: NavTabProps) {
  return (
    <button
      onClick={() => onClick(id)}
      className={`w-full text-left px-4 py-3 rounded transition-colors ${
        active
          ? 'bg-gray-800 text-gray-100'
          : 'text-gray-500 hover:text-gray-400 hover:bg-gray-900'
      }`}
    >
      {children}
    </button>
  );
}

export function LeftColumn() {
  const activeTab = useGameStore((s) => s.activeTab);
  const setActiveTab = (tab: 'actions' | 'skills' | 'spells' | 'combat' | 'housing') => {
    useGameStore.getState().setActiveTab(tab);
  };

  return (
    <div className="w-48 border-r border-gray-700 bg-gray-900 p-2">
      <nav className="flex flex-col gap-1">
        <NavTab id="actions" active={activeTab === 'actions'} onClick={setActiveTab}>
          Actions
        </NavTab>
        <NavTab id="skills" active={activeTab === 'skills'} onClick={setActiveTab}>
          Skills
        </NavTab>
        <NavTab id="spells" active={activeTab === 'spells'} onClick={setActiveTab}>
          Spells
        </NavTab>
        <NavTab id="combat" active={activeTab === 'combat'} onClick={setActiveTab}>
          Combat
        </NavTab>
        <NavTab id="housing" active={activeTab === 'housing'} onClick={setActiveTab}>
          Housing
        </NavTab>
      </nav>
    </div>
  );
}
