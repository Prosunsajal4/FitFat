import { useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) setTheme(saved);
  }, []);

  const toggle = () => {
    const next = theme === 'dark' ? 'amoled' : 'dark';
    setTheme(next);
    localStorage.setItem('theme', next);
  };

  return { theme, toggle, isAmoled: theme === 'amoled' };
}
