import type { GameState, ActionDefinition } from '../types';
import { ACTION_DEFS } from '../data/actions';

export function canExecuteUnlockAction(
  state: GameState,
  actionId: string,
  definition: ActionDefinition
): boolean {
  // Check if already executed (removed from actions)
  if (!state.actions[actionId]) return false;

  // Check unlock cost
  if (definition.unlockCost) {
    for (const [resource, amount] of Object.entries(definition.unlockCost)) {
      if ((state.resources[resource] || 0) < amount) {
        return false;
      }
    }
  }

  return true;
}

export function executeUnlockAction(
  state: GameState,
  actionId: string,
  definition: ActionDefinition
): Partial<GameState> {
  const updates: Partial<GameState> = {};

  // Consume unlock cost
  if (definition.unlockCost) {
    for (const [resource, amount] of Object.entries(definition.unlockCost)) {
      updates.resources = {
        ...updates.resources,
        [resource]: state.resources[resource] - amount,
      };
    }
  }

  // Award skill XP
  if (definition.skillXp) {
    for (const [skillId, xp] of Object.entries(definition.skillXp)) {
      const currentSkill = state.skills[skillId] || { level: 1, experience: 0 };
      updates.skills = {
        ...updates.skills,
        [skillId]: {
          ...currentSkill,
          experience: currentSkill.experience + xp,
        },
      };
    }
  }

  // Handle unlock effects
  const effect = definition.effect;
  if (effect === 'unlock-spell-slot') {
    updates.spells = {
      ...state.spells,
      slots: state.spells.slots + (definition.value as number || 1),
    };
  } else if (effect === 'unlock-action') {
    const newActionId = definition.value as string;
    const newActionDef = ACTION_DEFS[newActionId];
    if (newActionDef) {
      updates.actions = {
        ...updates.actions,
        [newActionId]: {
          executionCount: 0,
          isUnlocked: true,
          isActive: false,
          lastExecution: 0,
        },
      };
    }
  }

  // Remove the unlock action from available actions
  const remainingActions = { ...state.actions };
  delete remainingActions[actionId];
  updates.actions = { ...updates.actions, ...remainingActions };

  return updates;
}
