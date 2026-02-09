interface StatRowProps {
  label: string;
  value: string | number;
}

// Format number to remove trailing zeros
function formatNum(value: number): string {
  // Round to avoid floating point precision issues
  const rounded = Math.round(value * 100) / 100;
  if (Number.isInteger(rounded)) return rounded.toString();
  return rounded.toString();
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
