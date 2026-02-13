import type { ReactNode } from 'react';

interface SimpleTooltipProps {
  children: ReactNode;
  content: string;
}

/**
 * Simple tooltip component using native title attribute.
 * Avoids complex type issues with custom Tooltip component.
 */
export function SimpleTooltip({ children, content }: SimpleTooltipProps) {
  return (
    <>
      {children}
      <span title={content} className="text-xs text-gray-500 cursor-help border-b border-gray-700 rounded ml-2">ℹ️</span>
    </>
  );
}
