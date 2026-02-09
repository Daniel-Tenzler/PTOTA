import { formatNum } from '../../../utils/format';

interface StatRowProps {
  label: string;
  value: string | number;
}

export function StatRow({ label, value }: StatRowProps) {
  const displayValue = typeof value === 'number' ? formatNum(value) : value;

  return (
    <div className="flex justify-between text-gray-300">
      <span>{label}:</span>
      <span className="text-gray-100">{displayValue}</span>
    </div>
  );
}
