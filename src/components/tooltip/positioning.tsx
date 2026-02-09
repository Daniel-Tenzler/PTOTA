import type { Placement, Position, PositionResult } from './types';

const OFFSET = 8; // Gap between tooltip and trigger element

const PLACEMENT_ORDER: Record<Position, Position[]> = {
  top: ['top', 'bottom', 'left', 'right'],
  bottom: ['bottom', 'top', 'left', 'right'],
  left: ['left', 'right', 'top', 'bottom'],
  right: ['right', 'left', 'top', 'bottom'],
};

function getPlacementStyle(
  placement: Placement,
  triggerRect: DOMRect,
  tooltipRect: DOMRect
): React.CSSProperties {
  const [primary, secondary] = placement.split('-') as [Position, Position | undefined];

  const style: React.CSSProperties = {
    position: 'fixed' as const,
  };

  // Primary positioning
  switch (primary) {
    case 'top':
      style.top = triggerRect.top - tooltipRect.height - OFFSET;
      style.left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
      break;
    case 'bottom':
      style.top = triggerRect.bottom + OFFSET;
      style.left = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
      break;
    case 'left':
      style.top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
      style.left = triggerRect.left - tooltipRect.width - OFFSET;
      break;
    case 'right':
      style.top = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
      style.left = triggerRect.right + OFFSET;
      break;
  }

  // Secondary positioning (alignment)
  if (secondary) {
    switch (placement) {
      case 'top-left':
        style.left = triggerRect.left;
        break;
      case 'top-right':
        style.left = triggerRect.right - tooltipRect.width;
        break;
      case 'bottom-left':
        style.left = triggerRect.left;
        break;
      case 'bottom-right':
        style.left = triggerRect.right - tooltipRect.width;
        break;
      case 'left-top':
        style.top = triggerRect.top;
        break;
      case 'left-bottom':
        style.top = triggerRect.bottom - tooltipRect.height;
        break;
      case 'right-top':
        style.top = triggerRect.top;
        break;
      case 'right-bottom':
        style.top = triggerRect.bottom - tooltipRect.height;
        break;
    }
  }

  return style;
}

function fitsInViewport(
  style: React.CSSProperties,
  tooltipRect: DOMRect,
  viewportWidth: number,
  viewportHeight: number
): boolean {
  const top = (style.top as number) ?? 0;
  const left = (style.left as number) ?? 0;

  return (
    top >= 0 &&
    left >= 0 &&
    top + tooltipRect.height <= viewportHeight &&
    left + tooltipRect.width <= viewportWidth
  );
}

export function calculatePosition(
  triggerRect: DOMRect,
  tooltipRect: DOMRect,
  preferred: Placement = 'top'
): PositionResult {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Extract primary position from preferred placement
  const primary = preferred.split('-')[0] as Position;
  const placementsToTry = PLACEMENT_ORDER[primary];

  // Try each placement in order
  for (const placement of placementsToTry) {
    const style = getPlacementStyle(placement, triggerRect, tooltipRect);
    const fits = fitsInViewport(style, tooltipRect, viewportWidth, viewportHeight);
    if (fits) {
      return { placement, style };
    }
  }

  // Fallback: center in viewport
  const fallbackStyle: React.CSSProperties = {
    position: 'fixed' as const,
    top: (viewportHeight - tooltipRect.height) / 2,
    left: (viewportWidth - tooltipRect.width) / 2,
  };
  return {
    placement: preferred,
    style: fallbackStyle,
  };
}
