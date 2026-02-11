/**
 * Combat-related type definitions.
 */

export type CombatLogEntry = {
  type: 'player-attack' | 'enemy-attack' | 'spell-cast' | 'enemy-defeat';
  message: string;
  timestamp: number;
};

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

export interface DungeonDefinition {
  id: string;
  name: string;
  description: string;
  enemies: string[];  // Enemy IDs that spawn in this dungeon
  difficulty: number;
  levelRequirement: number;
}
