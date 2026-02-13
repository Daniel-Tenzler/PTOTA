import { Home, House, Building, Building2 } from 'lucide-react';
import { GraduationCap, Coins, Zap, Sword, Heart, Timer } from 'lucide-react';

export type HouseTier = 'shelter' | 'small-house' | 'medium-house' | 'large-house';
export type ItemCategory = 'skillCap' | 'passiveGen' | 'actionBonus' | 'combatDamage' | 'healthRegen' | 'spellCooldown';

export const HOUSE_ICONS: Record<HouseTier, React.ComponentType<{ className?: string }>> = {
  shelter: Home,
  'small-house': House,
  'medium-house': Building,
  'large-house': Building2,
};

export const CATEGORY_ICONS: Record<ItemCategory, React.ComponentType<{ className?: string }>> = {
  skillCap: GraduationCap,
  passiveGen: Coins,
  actionBonus: Zap,
  combatDamage: Sword,
  healthRegen: Heart,
  spellCooldown: Timer,
};

export const CATEGORY_COLORS: Record<ItemCategory, string> = {
  skillCap: 'text-purple-400',
  passiveGen: 'text-yellow-400',
  actionBonus: 'text-blue-400',
  combatDamage: 'text-red-400',
  healthRegen: 'text-pink-400',
  spellCooldown: 'text-cyan-400',
};

export const CATEGORY_LABELS: Record<ItemCategory, string> = {
  skillCap: 'Skill Cap',
  passiveGen: 'Passive Generation',
  actionBonus: 'Action Bonus',
  combatDamage: 'Combat Bonus',
  healthRegen: 'Health Regeneration',
  spellCooldown: 'Spell Cooldown',
};
