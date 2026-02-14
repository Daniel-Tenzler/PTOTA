import { formatNum } from '../../../utils/format';

interface StatRowProps {
  label: string;
  value: string | number;
  requirementMet?: boolean;
}

export function StatRow({ label, value, requirementMet = true }: StatRowProps) {
  const displayValue = typeof value === 'number' ? formatNum(value) : value;
  const textColor = requirementMet ? 'text-gray-300' : 'text-red-400';

  return (
    <div className={`flex justify-between ${textColor}`}>
      <span>{label}:</span>
      <span className="text-gray-100">{displayValue}</span>
    </div>
  );
}
