import { useState, useCallback } from 'react';

export function useKeyboardShortcuts(shortcuts = {}) {
  const [activeShortcut, setActiveShortcut] = useState(null);

  const handler = useCallback(
    (e) => {
      const key = [
        e.ctrlKey && 'ctrl',
        e.shiftKey && 'shift',
        e.altKey && 'alt',
        e.key.toLowerCase(),
      ]
        .filter(Boolean)
        .join('+');

      if (shortcuts[key]) {
        e.preventDefault();
        setActiveShortcut(key);
        shortcuts[key](e);
      }
    },
    [shortcuts]
  );

  const bind = useCallback(
    () => {
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    },
    [handler]
  );

  return { activeShortcut, bind };
}
