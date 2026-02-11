import { RESOURCE_CONFIG } from '../../config/resources';
import {
  Coins,
  Scroll,
  Flame,
  Droplets,
  Mountain,
  Zap,
  Heart,
  Circle,
} from 'lucide-react';

interface ResourceIconProps {
  resourceId: string;
}

/**
 * Icon component for resources.
 * Maps resource IDs to their configured Lucide icons with appropriate colors.
 */
export function ResourceIcon({ resourceId }: ResourceIconProps) {
  const config = RESOURCE_CONFIG[resourceId];

  const iconMap: Record<string, React.ElementType> = {
    Coins,
    Scroll,
    Flame,
    Droplets,
    Mountain,
    Zap,
    Heart,
  };

  const IconComponent = config?.icon
    ? (iconMap[config.icon] ?? Circle)
    : Circle;

  const colorClass = config?.color
    ? `text-${config.color}-400`
    : 'text-gray-400';

  return <IconComponent className={`h-4 w-4 ${colorClass}`} />;
}
