import type { GameState, ActionState } from '../types';
import { createActionState } from '../systems/actions/actionFactory';
import { ALL_ACTION_DEFS } from '../systems/actions';

/**
 * Starter actions that are unlocked by default.
 * These represent the basic actions available when a new game begins.
 */
export const STARTER_ACTIONS = new Set([
  'gain-gold',
  'hunt',
  'write-scrolls',
  'meditate',
  'learn-spellcasting',
  'unlock-enchanting',
  // Study actions are available from the start
  'study-arcane',
  'study-pyromancy',
  'study-hydromancy',
  'study-geomancy',
  'study-necromancy',
  'study-alchemy',
  'study-aeromancy',
]);

/**
 * Creates initial action states for all defined actions.
 * Actions in STARTER_ACTIONS are unlocked by default; others are locked.
 */
function createInitialActionStates(): Record<string, ActionState> {
  const states: Record<string, ActionState> = {};

  for (const actionId of Object.keys(ALL_ACTION_DEFS)) {
    states[actionId] = createActionState(STARTER_ACTIONS.has(actionId));
  }

  return states;
}

/**
 * Default game state for a new game.
 * Used when no saved state exists.
 */
export const DEFAULT_STATE: GameState = {
  resources: {
    gold: 0,
    scrolls: 0,
    'enchanted scrolls': 0,
    // Elemental resources
    ash: 0,
    springWater: 0,
    ore: 0,
    // Advanced elemental resources
    voidSalts: 0,
    stormGlass: 0,
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
  // Action states generated from ALL_ACTION_DEFS
  actions: createInitialActionStates(),
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
  housing: {
    ownedHouses: ['shelter'], // Start with basic shelter
    equippedItems: {
      shelter: [],
    },
    unlockedItems: [], // No items unlocked initially
    itemLocation: {}, // Reverse lookup for unequip
  },
  lastUpdate: Date.now(),
  activeTab: 'actions',
};
