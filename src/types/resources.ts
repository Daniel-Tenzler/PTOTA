/**
 * Resource-related type definitions.
 */

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
