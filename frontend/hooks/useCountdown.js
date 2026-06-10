import { useState, useRef, useCallback, useEffect } from 'react';

export default function useCountdown(initialSeconds = 60) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    clearTimer();
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearTimer();
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [clearTimer]);

  const stop = useCallback(() => {
    clearTimer();
    setIsRunning(false);
  }, [clearTimer]);

  const reset = useCallback(
    (newSeconds) => {
      clearTimer();
      setIsRunning(false);
      setSeconds(newSeconds !== undefined ? newSeconds : initialSeconds);
    },
    [clearTimer, initialSeconds]
  );

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  return {
    seconds,
    minutes: Math.floor(seconds / 60),
    hours: Math.floor(seconds / 3600),
    isRunning,
    start,
    stop,
    reset,
  };
}
