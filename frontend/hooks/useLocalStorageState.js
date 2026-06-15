import { useState, useCallback } from 'react';

export function useLocalStorageState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const set = useCallback(
    (value) => {
      setState((prev) => {
        const next = value instanceof Function ? value(prev) : value;
        try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
        return next;
      });
    },
    [key]
  );

  const remove = useCallback(() => {
    setState(initialValue);
    try { localStorage.removeItem(key); } catch {}
  }, [key, initialValue]);

  return [state, set, remove];
}
