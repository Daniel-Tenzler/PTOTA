/**
 * Combat-related constants for the game.
 * These values control timing, damage, and combat behavior.
 */

/**
 * Time (in seconds) between player auto-attacks during combat.
 */
export const PLAYER_ATTACK_INTERVAL = 2.5;

/**
 * Maximum number of entries to keep in the combat log.
 * Older entries are removed when this limit is exceeded.
 */
export const MAX_LOG_ENTRIES = 20;

/**
 * Base damage dealt by player per attack (before skill bonuses).
 */
export const PLAYER_BASE_DAMAGE = 5;

/**
 * Percentage of max health that player revives with after defeat.
 * Player regains this percentage of their maximum health when losing combat.
 */
export const PLAYER_REVIVE_HEALTH_PERCENT = 0.5;
