export type Position = 'top' | 'bottom' | 'left' | 'right';
export type Placement = Position | `${Position}-${Position}`;

export interface PositionResult {
  placement: Placement;
  style: React.CSSProperties;
}

export interface TooltipState {
  visible: boolean;
  placement: Placement;
  position: { x: number; y: number };
}

export type TooltipRenderer<T> = (data: T) => React.ReactNode;
