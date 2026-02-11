import { Wand2, Flame, Droplets, Gem, Skull, Beaker, Wind, Circle } from 'lucide-react';
import { SKILL_DEFS } from '../../data/skills';

type LucideIcon = typeof Wand2;

/**
 * Icon mapping for skills.
 * Maps each skill ID to its corresponding Lucide icon component.
 */
const SKILL_ICONS: Record<string, LucideIcon> = {
  arcane: Wand2,
  pyromancy: Flame,
  hydromancy: Droplets,
  geomancy: Gem,
  necromancy: Skull,
  alchemy: Beaker,
  aeromancy: Wind,
};

/**
 * Color mapping for skills.
 * Maps each skill ID to its theme color (used as text-{color}-400 class).
 */
const SKILL_COLORS: Record<string, string> = {
  arcane: 'purple',
  pyromancy: 'orange',
  hydromancy: 'blue',
  geomancy: 'yellow',
  necromancy: 'green',
  alchemy: 'pink',
  aeromancy: 'cyan',
};

export interface SkillIconProps {
  /** The skill ID to render the icon for */
  skillId: string;
  /** Additional CSS classes to apply */
  className?: string;
}

/**
 * Renders an icon for a given skill.
 * Uses the icon and color defined for the skill, falling back to a Circle icon with gray color.
 */
export function SkillIcon({ skillId, className = '' }: SkillIconProps) {
  const def = SKILL_DEFS[skillId];

  if (!def) {
    // Unknown skill - use fallback
    return <Circle className={`h-[18px] w-[18px] text-gray-400 ${className}`} />;
  }

  const IconComponent = SKILL_ICONS[skillId] ?? Circle;
  const color = SKILL_COLORS[skillId] ?? 'gray';

  return <IconComponent className={`h-[18px] w-[18px] text-${color}-400 ${className}`} />;
}
