import type { SpecialResource, SpecialResources } from '../../types';

/**
 * Merge a nested object within specialResources (stamina, health).
 *
 * @param base - The base special resource object
 * @param updates - Partial updates to apply
 * @returns A new merged object
 */
export function mergeSpecialResource(
  base: SpecialResource,
  updates?: Partial<SpecialResource>
): SpecialResource {
  if (!updates) return base;
  return { ...base, ...updates };
}

/**
 * Merge specialResources object (contains stamina and health).
 * Performs deep merge on nested special resource objects.
 *
 * @param base - The base special resources
 * @param updates - Partial updates to apply
 * @returns A new merged special resources object
 */
export function mergeSpecialResources(
  base: SpecialResources,
  updates?: Partial<SpecialResources>
): SpecialResources {
  if (!updates) return base;
  return {
    stamina: mergeSpecialResource(base.stamina, updates.stamina),
    health: mergeSpecialResource(base.health, updates.health),
  };
}

/**
 * Merge strategy for special resources with accumulator pattern.
 * Used internally by accumulateUpdates for incremental merging.
 *
 * @param accumulator - Previously accumulated updates
 * @param newValue - New updates to apply
 * @param baseValue - Original base value for reference
 * @returns Merged special resources
 */
export function mergeSpecialResourcesProperty(
  accumulator: SpecialResources | undefined,
  newValue: Partial<SpecialResources>,
  baseValue: SpecialResources
): SpecialResources {
  const acc = accumulator || baseValue;
  return {
    stamina: {
      current: newValue.stamina?.current ?? acc.stamina.current,
      max: newValue.stamina?.max ?? acc.stamina.max,
      regenRate: newValue.stamina?.regenRate ?? acc.stamina.regenRate,
    },
    health: {
      current: newValue.health?.current ?? acc.health.current,
      max: newValue.health?.max ?? acc.health.max,
      regenRate: newValue.health?.regenRate ?? acc.health.regenRate,
    },
  };
}
