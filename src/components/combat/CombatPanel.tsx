import { ProgressBar } from './ProgressBar';

interface CombatPanelProps {
  label: string;
  current: number;
  max: number;
  healthColor: 'red' | 'green';
  attackInterval: number;
  attackTimer: number;
  attackColor: 'orange' | 'blue';
}

export function CombatPanel({
  label,
  current,
  max,
  healthColor,
  attackInterval,
  attackTimer,
  attackColor,
}: CombatPanelProps) {
  return (
    <ProgressBar
      label={label}
      current={current}
      max={max}
      healthColor={healthColor}
      attackInterval={attackInterval}
      attackTimer={attackTimer}
      attackColor={attackColor}
    />
  );
}
