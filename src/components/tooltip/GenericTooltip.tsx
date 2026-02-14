/**
 * Detail for a single cost or stat entry.
 */
export interface TooltipDetail {
  label: string;
  value: string | number;
  format?: 'number' | 'string' | 'percentage';
}

/**
 * Generic tooltip data interface.
 * Works for both housing items and houses.
 */
export interface GenericTooltipData {
  name: string;
  description: string;
  details?: TooltipDetail[];
  cost?: Record<string, number>;
}

/**
 * Generic tooltip renderer component.
 * Displays tooltip content including name, description, details, and cost.
 */
export function genericTooltipRenderer({
  name,
  description,
  details = [],
  cost,
}: GenericTooltipData) {
  return (
    <div className="max-w-xs">
      <div className="font-semibold mb-1">{name}</div>
      <div className="text-sm text-gray-400 mb-2">{description}</div>

      {details.length > 0 && (
        <div className="text-xs text-gray-500 mb-2">
          {details.map((detail) => (
            <div key={`${detail.label}-${detail.value}`} className="mb-1">
              {detail.label}: {detail.format === 'percentage' ? `${detail.value}%` : detail.value}
            </div>
          ))}
        </div>
      )}

      {cost && Object.keys(cost).length > 0 && (
        <div className="text-xs text-gray-500">
          <div className="mb-1">Cost:</div>
          {Object.entries(cost).map(([resource, amount]) => (
            <div key={resource} className="text-sm">
              {amount} {resource}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Formats tooltip data for housing items.
 * Formats item properties as tooltip details.
 */
export function formatItemTooltipData(
  name: string,
  description: string,
  space: number,
  effectString: string,
  cost?: Record<string, number>
): GenericTooltipData {
  const details: TooltipDetail[] = [
    { label: 'Space', value: space },
    { label: 'Effect', value: effectString },
  ];

  return {
    name,
    description,
    details,
    cost,
  };
}

/**
 * Formats tooltip data for houses.
 * Formats house properties as tooltip details.
 */
export function formatHouseTooltipData(
  name: string,
  description: string,
  space: number,
  cost?: Record<string, number>
): GenericTooltipData {
  const details: TooltipDetail[] = [
    { label: 'Space', value: space },
  ];

  return {
    name,
    description,
    details,
    cost,
  };
}
