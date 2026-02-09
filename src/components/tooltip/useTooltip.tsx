import { useRef, useState, useCallback, useMemo } from 'react';
import { Tooltip } from './Tooltip';
import type { TooltipRenderer, Placement } from './types';

export function useTooltip<T>(
  content: TooltipRenderer<T>,
  data: T,
  placement: Placement = 'top',
  delay: number = 300,
  className: string = ''
) {
  const triggerRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dataRef = useRef(data);
  const contentRef = useRef(content);

  // Keep refs in sync
  dataRef.current = data;
  contentRef.current = content;

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setVisible(true);
    }, delay);
  }, [delay]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setVisible(false);
  }, []);

  const triggerProps = useMemo(
    () => ({
      ref: (el: HTMLElement | null) => {
        triggerRef.current = el;
      },
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    }),
    [handleMouseEnter, handleMouseLeave]
  );

  const tooltipElement = useMemo(
    () => (
      <Tooltip
        visible={visible}
        content={contentRef.current(dataRef.current)}
        triggerRef={triggerRef as React.RefObject<HTMLElement>}
        placement={placement}
        className={className}
      />
    ),
    [visible, placement, className]
  );

  return { triggerProps, tooltipElement };
}
