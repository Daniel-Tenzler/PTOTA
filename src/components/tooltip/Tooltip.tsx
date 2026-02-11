import { useLayoutEffect, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useTooltipPositioning } from './useTooltipPositioning';
import { calculatePosition } from './positioning';
import type { Placement } from './types';
import type { PositionState } from './useTooltipPositioning';

interface TooltipProps {
  visible: boolean;
  content: React.ReactNode;
  triggerRef: React.RefObject<HTMLElement>;
  placement?: Placement;
  className?: string;
}

export function Tooltip({
  visible,
  content,
  triggerRef,
  placement = 'top',
  className = '',
}: TooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);
  const { position, setPosition, resetPosition, updatePosition } = useTooltipPositioning(
    visible,
    triggerRef,
    placement
  );

  // Reset position state when visibility changes
  useEffect(() => {
    if (!visible) {
      resetPosition();
    }
  }, [visible, resetPosition]);

  // Use useLayoutEffect for immediate DOM measurement
  useLayoutEffect(() => {
    if (!visible || !triggerRef.current || !tooltipRef.current) {
      return;
    }

    // Use double rAF to ensure DOM is fully rendered
    requestAnimationFrame(() => {
      requestAnimationFrame(() => updatePosition(tooltipRef));
    });
  }, [visible, placement, triggerRef, updatePosition]);

  // Handle resize events to reposition tooltip
  useEffect(() => {
    if (!visible) return;

    const handleResize = () => {
      if (!triggerRef.current || !tooltipRef.current) return;
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      if (tooltipRect.width > 0 && tooltipRect.height > 0) {
        const result = calculatePosition(triggerRect, tooltipRect, placement);
        // Maintain opacity 1 during resize
        const newState: PositionState = { style: { ...result.style, opacity: 1 }, isPositioned: true };
        setPosition(newState);
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (tooltipRef.current) {
      resizeObserver.observe(tooltipRef.current);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [visible, placement, triggerRef, setPosition]);

  if (!visible) {
    return null;
  }

  return createPortal(
    <div
      ref={tooltipRef}
      className={`bg-gray-900 border border-gray-700 rounded shadow-xl max-w-sm p-4 text-sm z-[9999] ${className}`}
      style={position.style}
    >
      {content}
    </div>,
    document.body
  );
}
