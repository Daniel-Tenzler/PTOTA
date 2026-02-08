import { useGameLoop } from './hooks/useGameLoop';
import { useSave } from './hooks/useSave';
import { LeftColumn, CenterColumn } from './components/layout';
import { ResourcePanel } from './components/resources';

function App() {
  useGameLoop();
  useSave();

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100 overflow-hidden">
      <LeftColumn />
      <CenterColumn />
      <ResourcePanel />
    </div>
  );
}

export default App;
