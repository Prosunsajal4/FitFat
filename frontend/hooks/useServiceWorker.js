import { useState, useEffect, useCallback } from 'react';

export function useServiceWorker() {
  const [supported, setSupported] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    setSupported('serviceWorker' in navigator);
  }, []);

  const register = useCallback(async () => {
    if (!supported) return;
    try {
      await navigator.serviceWorker.register('/sw.js');
      setRegistered(true);
    } catch {}
  }, [supported]);

  return { supported, registered, register };
}
