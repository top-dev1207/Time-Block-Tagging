import { useRef, useCallback } from 'react';

// Custom hook for debouncing function calls
export function useDebounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedFunction = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        func(...args);
      }, delay);
    },
    [func, delay]
  );

  return debouncedFunction as T;
}

// Custom hook for throttling function calls
export function useThrottle<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): T {
  const lastCallRef = useRef<number>(0);

  const throttledFunction = useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      
      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        func(...args);
      }
    },
    [func, delay]
  );

  return throttledFunction as T;
}
