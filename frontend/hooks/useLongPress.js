import { useState, useEffect, useCallback } from 'react';

export function useLongPress(callback, ms = 500) {
  const [pressing, setPressing] = useState(false);
  const timeoutRef = useRef(null);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const start = useCallback(() => {
    setPressing(true);
    timeoutRef.current = setTimeout(() => {
      callbackRef.current();
      setPressing(false);
    }, ms);
  }, [ms]);

  const stop = useCallback(() => {
    clearTimeout(timeoutRef.current);
    setPressing(false);
  }, []);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop,
    pressing,
  };
}
