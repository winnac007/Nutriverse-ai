import { useEffect, useState, useRef, useCallback } from "react";

export function useThrottle<T>(value: T, limit: number): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastExecuted = useRef<number>(Date.now());

  useEffect(() => {
    if (Date.now() >= lastExecuted.current + limit) {
      lastExecuted.current = Date.now();
      setThrottledValue(value);
    } else {
      const timer = setTimeout(() => {
        lastExecuted.current = Date.now();
        setThrottledValue(value);
      }, limit - (Date.now() - lastExecuted.current));

      return () => clearTimeout(timer);
    }
  }, [value, limit]);

  return throttledValue;
}

export function useThrottleCallback<T extends (...args: any[]) => any>(
  callback: T,
  limit: number
): T {
  const lastRun = useRef(0);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useCallback(
    ((...args: any[]) => {
      const now = Date.now();
      if (now - lastRun.current >= limit) {
        lastRun.current = now;
        callback(...args);
      } else if (!timeout.current) {
        timeout.current = setTimeout(() => {
          lastRun.current = Date.now();
          timeout.current = null;
          callback(...args);
        }, limit - (now - lastRun.current));
      }
    }) as T,
    [callback, limit]
  );
}
