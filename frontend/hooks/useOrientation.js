import { useState, useEffect } from 'react';

export function useOrientation() {
  const [orientation, setOrientation] = useState(() => {
    if (typeof window === 'undefined') return 'portrait';
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
  });

  useEffect(() => {
    const handler = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return { orientation, isPortrait: orientation === 'portrait', isLandscape: orientation === 'landscape' };
}
