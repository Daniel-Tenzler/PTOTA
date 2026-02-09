import { create } from 'zustand';
import type { GameState } from '../types';
import { loadGame } from './saveStore';
import { mergeGameState } from '../utils/mergeUtils';
import { createActionsSlice, type GameActionsSlice } from './slices/gameActionsSlice';
import { createCombatSlice, type GameCombatSlice } from './slices/gameCombatSlice';
import { createSpellsSlice, type GameSpellsSlice } from './slices/gameSpellsSlice';

const SAVED_STATE = loadGame();

const DEFAULT_STATE: GameState = {
  resources: {
    gold: 0,
    scrolls: 0,
    'enchanted scrolls': 0,
    // Elemental resources
    ash: 0,
    springWater: 0,
    ore: 0,
  },
  specialResources: {
    stamina: {
      current: 10,
      max: 10,
      regenRate: 0.2, // per second
    },
    health: {
      current: 100,
      max: 100,
      regenRate: 0.1, // per second (very slow)
    },
  },
  // Starter actions (unlocked by default)
  actions: {
    'gain-gold': { executionCount: 0, isUnlocked: true, isActive: false, lastExecution: 0 },
    'write-scrolls': { executionCount: 0, isUnlocked: true, isActive: false, lastExecution: 0 },
    'meditate': { executionCount: 0, isUnlocked: true, isActive: false, lastExecution: 0 },
    // Unlock actions (available but not unlocked - they're their own category)
    'learn-spellcasting': { executionCount: 0, isUnlocked: true, isActive: false, lastExecution: 0 },
    'unlock-enchanting': { executionCount: 0, isUnlocked: true, isActive: false, lastExecution: 0 },
    // Elemental actions (locked until corresponding skill reaches level 2)
    'gather-ash': { executionCount: 0, isUnlocked: false, isActive: false, lastExecution: 0 },
    'collect-spring-water': { executionCount: 0, isUnlocked: false, isActive: false, lastExecution: 0 },
    'mine-ore': { executionCount: 0, isUnlocked: false, isActive: false, lastExecution: 0 },
    // Advanced gathering actions (locked until corresponding skill reaches level 2)
    'harvest-bone-dust': { executionCount: 0, isUnlocked: false, isActive: false, lastExecution: 0 },
    'transmute-void-salts': { executionCount: 0, isUnlocked: false, isActive: false, lastExecution: 0 },
    'capture-storm-glass': { executionCount: 0, isUnlocked: false, isActive: false, lastExecution: 0 },
    // Study actions (hidden from ActionsView)
    'study-arcane': { executionCount: 0, isUnlocked: true, isActive: false, lastExecution: 0 },
    'study-pyromancy': { executionCount: 0, isUnlocked: true, isActive: false, lastExecution: 0 },
    'study-hydromancy': { executionCount: 0, isUnlocked: true, isActive: false, lastExecution: 0 },
    'study-geomancy': { executionCount: 0, isUnlocked: true, isActive: false, lastExecution: 0 },
    'study-necromancy': { executionCount: 0, isUnlocked: true, isActive: false, lastExecution: 0 },
    'study-alchemy': { executionCount: 0, isUnlocked: true, isActive: false, lastExecution: 0 },
    'study-aeromancy': { executionCount: 0, isUnlocked: true, isActive: false, lastExecution: 0 },
  },
  skills: {
    arcane: { level: 1, experience: 0 },
    // Elemental magic disciplines
    pyromancy: { level: 1, experience: 0 },
    hydromancy: { level: 1, experience: 0 },
    geomancy: { level: 1, experience: 0 },
    // Advanced magical disciplines
    necromancy: { level: 1, experience: 0 },
    alchemy: { level: 1, experience: 0 },
    aeromancy: { level: 1, experience: 0 },
  },
  spells: {
    slots: 1,
    equipped: [],
    cooldowns: {},
  },
  combat: {
    isActive: false,
    currentEnemy: null,
    playerAttackTimer: 2.5,
    enemyAttackTimer: 0,
    log: [],
  },
  dungeons: {
    unlocked: ['dark-forest'],
    selected: null,
  },
  lastUpdate: Date.now(),
  activeTab: 'actions',
};

const INITIAL_STATE: GameState = SAVED_STATE
  ? mergeGameState(DEFAULT_STATE, SAVED_STATE)
  : DEFAULT_STATE;

interface GameStore extends GameState, GameActionsSlice, GameCombatSlice, GameSpellsSlice {
  update: (delta: number, timestamp: number) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...INITIAL_STATE,

  // Game loop update method
  update: (_delta: number, _timestamp: number) => {
    // Will be populated by game loop later
  },

  // Combine all slices
  ...createActionsSlice(set, get),
  ...createCombatSlice(set, get),
  ...createSpellsSlice(set, get),
}));
