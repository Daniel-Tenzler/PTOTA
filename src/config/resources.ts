/**
 * Resource configuration mapping.
 * Maps resource IDs to their display icons and color themes.
 */

export interface ResourceConfig {
  icon: string;
  color: string;
}

export interface ResourceConfigMap {
  [resourceId: string]: ResourceConfig;
}

/**
 * Configuration for all resources in the game.
 * - icon: Lucide icon name for display
 * - color: Tailwind color name (maps to text-{color}-400, bg-{color}-500, etc.)
 */
export const RESOURCE_CONFIG: ResourceConfigMap = {
  // Standard resources
  gold: {
    icon: 'Coins',
    color: 'yellow',
  },
  scrolls: {
    icon: 'Scroll',
    color: 'stone',
  },
  'enchanted scrolls': {
    icon: 'Scroll',
    color: 'purple',
  },
  ash: {
    icon: 'Flame',
    color: 'gray',
  },
  springWater: {
    icon: 'Droplets',
    color: 'cyan',
  },
  ore: {
    icon: 'Mountain',
    color: 'orange',
  },
  // Special resources
  stamina: {
    icon: 'Zap',
    color: 'amber',
  },
  health: {
    icon: 'Heart',
    color: 'emerald',
  },
};
