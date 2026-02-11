import { useEffect, useState, useRef } from 'react';

interface UseSmoothProgressOptions {
  duration: number;           // Duration in seconds
  startTime: number;          // Timestamp when action started (ms)
  isRunning: boolean;         // Whether the action is active
}

interface UseSmoothProgressResult {
  progress: number;           // 0-100 percentage
  timeRemaining: number;      // Time remaining in seconds (display value)
}

export function useSmoothProgress({ duration, startTime, isRunning }: UseSmoothProgressOptions): UseSmoothProgressResult {
  const [result, setResult] = useState<UseSmoothProgressResult>({
    progress: 0,
    timeRemaining: duration,
  });

  const frameRef = useRef<number>();

  useEffect(() => {
    if (!isRunning) {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      return;
    }

    const animate = () => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000; // Convert to seconds
      const total = duration;

      const progress = Math.min(100, Math.max(0, (elapsed / total) * 100));
      const remaining = Math.max(0, total - elapsed);

      setResult({
        progress,
        timeRemaining: Math.floor(remaining),
      });

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [duration, startTime, isRunning]);

  return result;
}
