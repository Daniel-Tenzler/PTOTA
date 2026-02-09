import { create } from 'zustand';
import type { GameState } from '../types';
import { ALL_ACTION_DEFS } from '../systems/actions';
import { canExecuteAction, executeAction as executeActionSystem } from '../systems/actions';
import { toggleTimedAction } from '../systems/timedActions';
import { loadGame } from './saveStore';

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
  },
  skills: {
    arcane: { level: 1, experience: 0 },
    // Elemental magic disciplines
    pyromancy: { level: 1, experience: 0 },
    hydromancy: { level: 1, experience: 0 },
    geomancy: { level: 1, experience: 0 },
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

const INITIAL_STATE: GameState = SAVED_STATE ? {
  ...DEFAULT_STATE,
  ...SAVED_STATE,
  // Deep merge nested objects
  resources: { ...DEFAULT_STATE.resources, ...SAVED_STATE.resources },
  specialResources: {
    stamina: { ...DEFAULT_STATE.specialResources.stamina, ...(SAVED_STATE.specialResources?.stamina || {}) },
    health: { ...DEFAULT_STATE.specialResources.health, ...(SAVED_STATE.specialResources?.health || {}) },
  },
  actions: { ...DEFAULT_STATE.actions, ...SAVED_STATE.actions },
  skills: { ...DEFAULT_STATE.skills, ...(SAVED_STATE.skills || {}) },
  spells: { ...DEFAULT_STATE.spells, ...SAVED_STATE.spells },
  combat: { ...DEFAULT_STATE.combat, ...SAVED_STATE.combat },
  dungeons: { ...DEFAULT_STATE.dungeons, ...SAVED_STATE.dungeons },
} : DEFAULT_STATE;

interface GameStore extends GameState {
  update: (delta: number, timestamp: number) => void;
  executeAction: (actionId: string) => void;
  toggleTimedAction: (actionId: string) => void;
  updateCombat: (updater: (state: GameState) => Partial<GameState>) => void;
  setActiveTab: (tab: 'actions' | 'skills' | 'spells' | 'combat') => void;
  equipSpell: (spellId: string) => void;
  unequipSpell: (spellId: string) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  ...INITIAL_STATE,
  update: (_delta: number, _timestamp: number) => {
    // Will be populated by game loop later
  },
  executeAction: (actionId: string) => {
    const state = get();
    const definition = ALL_ACTION_DEFS[actionId];
    if (!definition) return;

    if (canExecuteAction(state, actionId, definition)) {
      const updates = executeActionSystem(state, actionId, definition);

      // Deep merge nested objects to avoid losing data
      set({
        ...state,
        ...updates,
        resources: { ...state.resources, ...updates.resources },
        specialResources: updates.specialResources ? {
          stamina: { ...state.specialResources.stamina, ...(updates.specialResources?.stamina || {}) },
          health: { ...state.specialResources.health, ...(updates.specialResources?.health || {}) },
        } : state.specialResources,
        actions: { ...state.actions, ...updates.actions },
        skills: { ...state.skills, ...updates.skills },
        spells: updates.spells ? {
          ...state.spells,
          ...updates.spells,
          cooldowns: { ...state.spells.cooldowns, ...(updates.spells?.cooldowns || {}) },
        } : state.spells,
        combat: updates.combat ? { ...state.combat, ...updates.combat } : state.combat,
      });
    }
  },
  toggleTimedAction: (actionId: string) => {
    const state = get();
    const updates = toggleTimedAction(state, actionId);
    set({
      ...state,
      ...updates,
      actions: { ...state.actions, ...updates.actions },
    });
  },
  updateCombat: (updater) => {
    const state = get();
    const updates = updater(state);
    set({
      ...state,
      ...updates,
      combat: updates.combat ? { ...state.combat, ...updates.combat } : state.combat,
    });
  },
  setActiveTab: (tab) => {
    set({ activeTab: tab });
  },
  equipSpell: (spellId: string) => {
    const state = get();
    if (state.spells.equipped.includes(spellId)) return;
    if (state.spells.equipped.length >= state.spells.slots) return;

    set({
      spells: {
        ...state.spells,
        equipped: [...state.spells.equipped, spellId],
      },
    });
  },
  unequipSpell: (spellId: string) => {
    const state = get();
    set({
      spells: {
        ...state.spells,
        equipped: state.spells.equipped.filter((id) => id !== spellId),
        cooldowns: {
          ...state.spells.cooldowns,
          [spellId]: 0,
        },
      },
    });
  },
}));
