// Resource types
export interface Resources {
  [resourceId: string]: number;
}

export interface SpecialResource {
  current: number;
  max: number;
  regenRate: number;
}

export interface SpecialResources {
  stamina: SpecialResource;
  health: SpecialResource;
}

// Action types
export type ActionCategory = 'resource-producing' | 'resource-processing' | 'timed' | 'unlock';

export interface ActionDefinition {
  id: string;
  name: string;
  category: ActionCategory;
  inputs: { [resourceId: string]: number };
  outputs: { [resourceId: string]: number };
  staminaCost?: number;
  duration?: number;  // 0 = instant, >0 = timed
  skillXp?: { [skillId: string]: number };
  requiredSkill?: { skillId: string; level: number };
  unlockCost?: { [resourceId: string]: number };
  rankBonus: (executions: number) => number;
  effect?: string;  // For unlock actions: 'unlock-spell-slot', 'unlock-action', etc.
  value?: SkillBonusValue;  // Value associated with the effect
}

export interface ActionState {
  executionCount: number;
  isUnlocked: boolean;
  isActive: boolean;
  lastExecution: number;
}

// Skill types
export interface SkillDefinition {
  id: string;
  name: string;
  xpTable: number[];
  bonuses: SkillBonus[];
}

export type SkillBonusValue = string | number | boolean;

export interface SkillBonus {
  level: number;
  effect: string;
  value: SkillBonusValue;
}

export interface SkillState {
  level: number;
  experience: number;
}

// Spell types
export interface SpellDefinition {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  effect: (state: GameState) => number;
}

export interface SpellState {
  slots: number;
  equipped: string[];
  cooldowns: { [spellId: string]: number };
}

export type CombatLogEntry = {
  type: 'player-attack' | 'enemy-attack' | 'spell-cast' | 'enemy-defeat';
  message: string;
  timestamp: number;
};

// Combat types
export interface Enemy {
  id: string;
  name: string;
  health: number;
  maxHealth: number;
  damage: number;
  attackInterval: number;
  rewards: { [resourceId: string]: number };
}

export interface CombatState {
  isActive: boolean;
  currentEnemy: Enemy | null;
  playerAttackTimer: number;
  enemyAttackTimer: number;
  log: CombatLogEntry[];
}

// Dungeon types
export interface DungeonDefinition {
  id: string;
  name: string;
  description: string;
  enemies: string[];  // Enemy IDs that spawn in this dungeon
  difficulty: number;
  levelRequirement: number;
}

// Main game state
export interface GameState {
  resources: Resources;
  specialResources: SpecialResources;
  actions: { [actionId: string]: ActionState };
  skills: { [skillId: string]: SkillState };
  spells: SpellState;
  combat: CombatState;
  dungeons: {
    unlocked: string[];
    selected: string | null;
  };
  lastUpdate: number;
  activeTab: 'actions' | 'skills' | 'spells' | 'combat';
}
