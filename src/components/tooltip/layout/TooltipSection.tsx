import type { ReactNode } from 'react';

interface TooltipSectionProps {
  label: string;
  children: ReactNode;
}

export function TooltipSection({ label, children }: TooltipSectionProps) {
  return (
    <div>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      {children}
    </div>
  );
}
