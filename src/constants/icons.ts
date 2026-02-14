/**
 * Icon-related constants for the game.
 * Maps icon names from data definitions to Lucide React icon components.
 */

import { Flame, Snowflake, Zap, Waves, Wind, Sparkles, type LucideIcon } from 'lucide-react';

/**
 * Mapping from icon name strings (used in data definitions) to icon components.
 * Add new icons here as they are introduced to the game.
 */
export const ICON_MAP: Record<string, LucideIcon> = {
  Flame,
  Snowflake,
  Zap,
  Waves,
  Wind,
  Sparkles,
};
