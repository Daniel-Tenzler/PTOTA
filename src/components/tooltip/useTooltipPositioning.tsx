import { useState, useRef, type CSSProperties, type RefObject } from 'react';
import { calculatePosition } from './positioning';
import type { Placement } from './types';

const MAX_POSITIONING_ATTEMPTS = 10;
const POSITIONING_RETRY_DELAY = 50;

export interface PositionState {
  style: CSSProperties;
  isPositioned: boolean;
}

interface TooltipPositioningResult {
  position: PositionState;
  setPosition: (state: PositionState) => void;
  resetPosition: () => void;
  updatePosition: (tooltipRef: RefObject<HTMLElement>) => void;
}

/**
 * Custom hook for handling tooltip positioning with retry logic.
 * Manages the positioning state and retries when tooltip dimensions are not yet available.
 *
 * @param _visible - Whether the tooltip is visible (kept for API consistency)
 * @param triggerRef - Reference to the trigger element
 * @param placement - Preferred placement for the tooltip
 * @returns Position result containing style and positioning status
 */
export function useTooltipPositioning(
  _visible: boolean,
  triggerRef: RefObject<HTMLElement>,
  placement: Placement = 'top'
): TooltipPositioningResult {
  const [position, setPosition] = useState<PositionState>({
    style: { opacity: 0, left: 0, top: 0, position: 'fixed', pointerEvents: 'none' },
    isPositioned: false,
  });
  const positioningAttemptsRef = useRef(0);

  // Reset position state when visibility changes
  const resetPosition = () => {
    setPosition({
      style: { opacity: 0, left: 0, top: 0, position: 'fixed', pointerEvents: 'none' },
      isPositioned: false,
    });
    positioningAttemptsRef.current = 0;
  };

  // Update position with retry logic
  const updatePosition = (tooltipRef: RefObject<HTMLElement>) => {
    if (!tooltipRef.current || !triggerRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();

    // Check if tooltip has valid dimensions
    if (tooltipRect.width > 0 && tooltipRect.height > 0) {
      const result = calculatePosition(triggerRect, tooltipRect, placement);
      setPosition({ style: { ...result.style, opacity: 1 }, isPositioned: true });
      positioningAttemptsRef.current = 0;
    } else if (positioningAttemptsRef.current < MAX_POSITIONING_ATTEMPTS) {
      // Retry after a short delay
      positioningAttemptsRef.current++;
      setTimeout(() => updatePosition(tooltipRef), POSITIONING_RETRY_DELAY);
    }
  };

  return {
    position,
    setPosition,
    resetPosition,
    updatePosition,
  };
}
