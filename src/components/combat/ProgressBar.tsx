interface ProgressBarProps {
  label: string;
  current: number;
  max: number;
  healthColor: 'red' | 'green';
  attackInterval: number;
  attackTimer: number;
  attackColor: 'orange' | 'blue';
}

export function ProgressBar({
  label,
  current,
  max,
  healthColor,
  attackInterval,
  attackTimer,
  attackColor,
}: ProgressBarProps) {
  const healthPercent = (current / max) * 100;
  const attackPercent = ((attackInterval - attackTimer) / attackInterval) * 100;

  const healthColorClass = healthColor === 'red' ? 'bg-red-900' : 'bg-green-900';
  const attackColorClass = attackColor === 'orange' ? 'bg-orange-900' : 'bg-blue-900';

  return (
    <div className="bg-gray-800 p-4 rounded">
      <div className="flex justify-between mb-2">
        <span className="text-gray-100">{label}</span>
        <span className="text-gray-400">{Math.ceil(current)} / {max}</span>
      </div>
      <div className="h-3 bg-gray-900 rounded-full overflow-hidden mb-2">
        <div
          className={`h-full ${healthColorClass} transition-all duration-75`}
          style={{ width: `${healthPercent}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 mb-1">
        <span>Attack: {attackInterval}s</span>
        <span>{Math.ceil(attackTimer * 10) / 10}s</span>
      </div>
      <div className="h-1.5 bg-gray-900 rounded-full overflow-hidden">
        <div
          className={`h-full ${attackColorClass} transition-all duration-75`}
          style={{ width: `${attackPercent}%` }}
        />
      </div>
    </div>
  );
}
