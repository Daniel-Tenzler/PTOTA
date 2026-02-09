/**
 * Action System
 *
 * This module provides a unified interface for all action-related functionality.
 * The implementation has been refactored into focused modules:
 * - actionRegistry: Action definitions and helpers
 * - actionValidator: Action execution validation
 * - actionExecutor: Action execution logic
 * - actionToggler: Study action toggle behavior
 *
 * All exports are re-exported here for backward compatibility.
 */

// Action definitions registry
export { ALL_ACTION_DEFS, isStudyAction } from './actions/actionRegistry';

// Action validation
export { canExecuteAction } from './actions/actionValidator';

// Action execution
export { executeAction } from './actions/actionExecutor';

// Study action toggling
export { toggleStudyAction } from './actions/actionToggler';
