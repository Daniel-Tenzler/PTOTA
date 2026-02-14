import { formatNum } from '../../../utils/format';

interface ResourceListProps {
  resources: Record<string, number>;
  bonus?: number;
  currentResources?: Record<string, number>;
}

export function ResourceList({ resources, bonus = 0, currentResources }: ResourceListProps) {
  const entries = Object.entries(resources).filter(([_, amount]) => amount > 0);

  if (entries.length === 0) return null;

  // Display first 3 items
  const displayEntries = entries.slice(0, 3);
  const remainingCount = entries.length - 3;

  // Only apply bonus if it's greater than 0
  const hasBonus = Boolean(bonus && bonus > 0);

  // Only color red if we're specifically checking requirements (currentResources provided)
  const checkingRequirements = currentResources !== undefined;

  return (
    <div>
      {displayEntries.map(([resource, amount], index) => {
        const finalAmount = hasBonus ? Math.floor(amount * (1 + bonus)) : amount;
        const bonusPercent = hasBonus ? Math.floor(bonus * 100) : 0;
        const showBonus = hasBonus && bonusPercent > 0;
        const hasEnough = checkingRequirements ? ((currentResources?.[resource] || 0) >= amount) : true;

        return (
          <span key={resource} className={hasEnough ? 'text-gray-300' : 'text-red-400'}>
            {index > 0 ? ', ' : null}
            {formatNum(finalAmount)} {resource}
            {showBonus ? (
              <span className="text-green-400 ml-1">(+{bonusPercent}%)</span>
            ) : null}
          </span>
        );
      })}
      {remainingCount > 0 ? (
        <span className="text-gray-500">, and {remainingCount} more...</span>
      ) : null}
    </div>
  );
}
