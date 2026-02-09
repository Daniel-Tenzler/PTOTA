import { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { calculatePosition } from './positioning.tsx';
import type { Placement } from './types';

interface TooltipProps {
  visible: boolean;
  content: React.ReactNode;
  triggerRef: React.RefObject<HTMLElement>;
  placement?: Placement;
  className?: string;
}

const MAX_POSITIONING_ATTEMPTS = 10;
const POSITIONING_RETRY_DELAY = 50;

export function Tooltip({
  visible,
  content,
  triggerRef,
  placement = 'top',
  className = '',
}: TooltipProps) {
  const [position, setPosition] = useState<{
    style: React.CSSProperties;
    isPositioned: boolean;
  }>({
    style: { opacity: 0, left: 0, top: 0, position: 'fixed', pointerEvents: 'none' },
    isPositioned: false,
  });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const positioningAttemptsRef = useRef(0);

  // Reset position state when visibility changes
  useEffect(() => {
    if (!visible) {
      setPosition({
        style: { opacity: 0, left: 0, top: 0, position: 'fixed', pointerEvents: 'none' },
        isPositioned: false,
      });
      positioningAttemptsRef.current = 0;
    }
  }, [visible]);

  // Use useLayoutEffect for immediate DOM measurement
  useLayoutEffect(() => {
    if (!visible || !triggerRef.current || !tooltipRef.current) {
      return;
    }

    const updatePosition = () => {
      if (!tooltipRef.current || !triggerRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      // Check if tooltip has valid dimensions
      if (tooltipRect.width > 0 && tooltipRect.height > 0) {
        const result = calculatePosition(triggerRect, tooltipRect, placement);
        // Set opacity to 1 when positioned to make it visible
        setPosition({ style: { ...result.style, opacity: 1 }, isPositioned: true });
        positioningAttemptsRef.current = 0;
      } else if (positioningAttemptsRef.current < MAX_POSITIONING_ATTEMPTS) {
        // Retry after a short delay
        positioningAttemptsRef.current++;
        setTimeout(updatePosition, POSITIONING_RETRY_DELAY);
      }
    };

    // Use double rAF to ensure DOM is fully rendered
    requestAnimationFrame(() => {
      requestAnimationFrame(updatePosition);
    });
  }, [visible, placement, triggerRef]);

  useEffect(() => {
    if (!visible) return;

    const handleResize = () => {
      if (!triggerRef.current || !tooltipRef.current) return;
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      if (tooltipRect.width > 0 && tooltipRect.height > 0) {
        const result = calculatePosition(triggerRect, tooltipRect, placement);
        // Maintain opacity 1 during resize
        setPosition({ style: { ...result.style, opacity: 1 }, isPositioned: true });
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
  }, [visible, placement, triggerRef]);

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
